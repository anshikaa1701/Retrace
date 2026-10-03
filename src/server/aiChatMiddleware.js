// ReTrace AI Technical Product Assistant - Backend Middleware
// Rate limiting, safety guardrails, Gemini API integration & offline technical engine

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // 25 requests per minute

const SYSTEM_INSTRUCTION = `You are ReTrace AI, a technical product assistant.

Your job is to help users understand common, low-risk technical problems with consumer products such as smartphones, laptops, tablets, smartwatches, TVs, appliances and other electronics.

Use the product information and repair history provided by ReTrace when available.

Give practical troubleshooting steps.

Clearly distinguish:
- likely cause
- simple checks the user can perform
- when professional repair is recommended
- whether repair may be preferable to replacement

Never claim certainty when the diagnosis is uncertain.

Do not invent product specifications, repair history, part availability, prices, repair shops, or technical facts.

Do not provide dangerous instructions involving mains electricity, batteries, opening hazardous components, fire, chemicals, or other potentially unsafe procedures.

For potentially dangerous problems such as:
- swollen batteries
- smoke
- burning smell
- sparks
- overheating batteries
- electrical shock
- liquid damage involving powered electronics

prioritize safety and recommend stopping use and contacting a qualified professional.

Do not pretend to be a certified technician.

The assistant should explain technical concepts in simple language.

Keep responses concise and useful unless the user asks for more detail.

The purpose is to help the user decide the next safe step, not to replace a professional repair technician.`;

// Safety keyword guardrails
const DANGEROUS_PATTERNS = [
  /(?:swollen|bulging|puffed|expanding|bloated)\s*.*(?:battery|cell)/i,
  /(?:battery|cell)\s*.*(?:swollen|bulging|puffed|expanding|bloated)/i,
  /(?:puncture|pierce|stab|needle|poke)\s*.*(?:battery|cell)/i,
  /(?:battery|cell)\s*.*(?:puncture|pierce|stab|needle|poke)/i,
  /(?:battery|device|laptop|phone)\s*.*(?:smoke|smoking|fumes)/i,
  /(?:smoke|smoking|fumes)\s*.*(?:battery|device|laptop|phone)/i,
  /burning\s*(?:smell|odor|plastic|circuit)/i,
  /sparking|sparks|electrical\s*arc/i,
  /electric\s*shock|shocked\s*me/i,
  /fire|flames|ignited|caught\s*fire|exploded|exploding/i,
  /microwave.*capacitor/i,
  /bypass.*fuse/i
];

export function handleAiChatRequest(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: 'Too Many Requests',
      reply: 'ReTrace AI is experiencing high traffic. Please wait a moment before asking another question.'
    }));
    return;
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);

  // Read Body
  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
    // Protect against oversized payload
    if (rawBody.length > 100 * 1024) {
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(rawBody || '{}');
      const userMessage = data.message?.trim() || '';

      if (!userMessage) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Message is required' }));
        return;
      }

      // Check Immediate Safety Guardrails
      const isDangerous = DANGEROUS_PATTERNS.some(pat => pat.test(userMessage));
      if (isDangerous) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          reply: `⚠️ **CRITICAL SAFETY WARNING: STOP USE IMMEDIATELY**\n\n` +
            `This issue indicates a potential fire, chemical, or electrical hazard. **Do not attempt to puncture, charge, or open the device.**\n\n` +
            `1. **Disconnect from power** immediately if safe to do so.\n` +
            `2. **Move the device** to a non-flammable surface (e.g. tile or concrete), away from heat and people.\n` +
            `3. **Contact a certified ReTrace repair specialist** or authorized hazardous electronics disposal center immediately for safe handling.`,
          structuredAction: {
            likelyIssue: 'Severe Battery / Electrical Hardware Hazard',
            nextSafeCheck: 'Cease all charging and power immediately; store on a fire-safe surface.',
            recommendedPath: 'PROFESSIONAL_REPAIR',
            confidence: 'High',
            suggestedActions: [
              { label: 'FIND CERTIFIED SPECIALIST', action: 'repairer', link: '/repairers' },
              { label: 'VIEW EMERGENCY PROTOCOL', action: 'protocol', link: '/repairers' }
            ]
          }
        }));
        return;
      }

      // Fetch from Google Gemini if API Key is available
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

      if (geminiApiKey) {
        try {
          const response = await callGeminiAPI(geminiApiKey, data);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
          return;
        } catch (geminiErr) {
          console.warn('[ReTrace AI] Gemini API call error, falling back to local technical engine:', geminiErr);
          // Fall through to local intelligent fallback
        }
      }

      // Local Intelligent Technical Fallback (Compliant with ReTrace system instruction)
      const fallbackResponse = generateLocalTechnicalDiagnosis(data);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(fallbackResponse));

    } catch (err) {
      console.error('[ReTrace AI Backend Error]:', err);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        reply: 'ReTrace AI is temporarily unavailable. Please try again in a moment.',
        structuredAction: null
      }));
    }
  });
}

// Call Google Gemini 1.5 Flash via REST
async function callGeminiAPI(apiKey, data) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Build context prefix if product context is attached
  let contextPrompt = '';
  if (data.productContext) {
    contextPrompt = `[PRODUCT CONTEXT AVAILABLE ON RETRACE]
Brand: ${data.productContext.brand || 'Unknown'}
Model: ${data.productContext.model || 'Unknown'}
Condition: ${data.productContext.condition || 'Active'}
ReTrace ID: ${data.productId || 'N/A'}
Verified Repairs: ${data.productContext.verifiedRepairsCount || 0}
Last Maintenance: ${data.productContext.lastRepair || 'None recorded'}
---\n`;
  }

  const promptText = `${contextPrompt}User Problem: ${data.message}

Please provide:
1. Concise explanation of the likely cause.
2. 2-3 simple, safe non-invasive checks the user can do at home.
3. Clear recommendation whether professional repair or replacement is appropriate.
4. Conclude with a JSON metadata block formatted exactly as:
\`\`\`json
{
  "likelyIssue": "Brief issue title",
  "nextSafeCheck": "One simple check",
  "recommendedPath": "REPAIR" | "RESALE" | "RECOVERY" | "MAINTENANCE",
  "confidence": "High" | "Moderate" | "Low"
}
\`\`\``;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract JSON action card if present
  let cleanReply = rawText;
  let structuredAction = null;

  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      structuredAction = {
        likelyIssue: parsed.likelyIssue || 'Hardware Diagnostic Assessment',
        nextSafeCheck: parsed.nextSafeCheck || 'Monitor device operating temperature and battery status.',
        recommendedPath: parsed.recommendedPath || 'REPAIR',
        confidence: parsed.confidence || 'Moderate',
        suggestedActions: [
          ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      };
      // Remove JSON block from markdown message
      cleanReply = rawText.replace(/```json[\s\S]*?```/, '').trim();
    } catch {
      // Ignored if JSON parsing fails
    }
  }

  return {
    success: true,
    reply: cleanReply || 'Troubleshooting assessment generated.',
    structuredAction
  };
}

// Local Technical Diagnosis Engine (Fallback compliant with safety rules and system instructions)
function generateLocalTechnicalDiagnosis(data) {
  const msg = data.message.toLowerCase();
  const prod = data.productContext;
  const prodName = prod ? `${prod.brand || ''} ${prod.model || ''}`.trim() : 'your device';

  if (msg.includes('heat') || msg.includes('hot') || msg.includes('fan') || msg.includes('thermal')) {
    return {
      success: true,
      reply: `### Likely Cause for Overheating on ${prodName}\n\n` +
        `Elevated thermals typically stem from **dust blockage in the cooling fins**, dried thermal compound between the silicon die and heatpipe, or continuous high CPU background processes.\n\n` +
        `#### Simple Checks You Can Perform:\n` +
        `1. **Inspect Exhaust Vents:** Check air vents with a flashlight to verify there is no visible lint or particulate blockage.\n` +
        `2. **Check Process Load:** Open Task Manager (Windows) or Activity Monitor (macOS) to identify background tasks running above 80% CPU usage.\n` +
        `3. **Elevate Surface:** Ensure the device rests on a hard, flat surface rather than a blanket or lap.\n\n` +
        `#### Recommended Next Path:\n` +
        `If the fan continues to run at maximum RPM even at idle, a **bench ultrasonic dust cleanout and fresh Arctic thermal paste application** by a certified technician is recommended. Repairing the cooling system extends device longevity by 2–4 years and is far more economical than premature replacement.`,
      structuredAction: {
        likelyIssue: 'Thermal Paste Degradation & Heatsink Obstruction',
        nextSafeCheck: 'Inspect air exhaust vents and check Task Manager for runaway CPU processes.',
        recommendedPath: 'REPAIR',
        confidence: 'High',
        suggestedActions: [
          ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      }
    };
  }

  if (msg.includes('battery') || msg.includes('drain') || msg.includes('charge') || msg.includes('power')) {
    return {
      success: true,
      reply: `### Battery & Power Analysis for ${prodName}\n\n` +
        `Lithium-ion cells naturally degrade with charge cycles and heat exposure. Common causes of rapid drain include chemical aging, background location services, or DC power port contact resistance.\n\n` +
        `#### Simple Checks You Can Perform:\n` +
        `1. **Check Battery Health:** In Settings > Battery, inspect overall capacity health percentage.\n` +
        `2. **Inspect Cable & Connector:** Check the charging cable pins for bent contacts or lint buildup in the port (use a dry wooden toothpick only, never metal).\n` +
        `3. **Test with Verified Power Brick:** Try an alternate OEM-certified charger.\n\n` +
        `#### Recommended Next Path:\n` +
        `If battery health is below 80% or the device unexpectedly shuts down at 20–30%, an **OEM battery replacement** will restore full-day runtime. ReTrace verified technicians can log the new cycle count to your device passport.`,
      structuredAction: {
        likelyIssue: 'Lithium Cell Capacity Degradation',
        nextSafeCheck: 'Check battery health percentage in System Settings and inspect port for lint.',
        recommendedPath: 'REPAIR',
        confidence: 'High',
        suggestedActions: [
          ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      }
    };
  }

  if (msg.includes('slow') || msg.includes('lag') || msg.includes('freeze') || msg.includes('performance')) {
    return {
      success: true,
      reply: `### Performance Diagnostic for ${prodName}\n\n` +
        `Performance slowdowns are commonly caused by **storage drive exhaustion (above 85% capacity)**, fragmented background indexing, insufficient RAM memory pressure, or thermal throttling.\n\n` +
        `#### Simple Checks You Can Perform:\n` +
        `1. **Check Free Storage:** Solid-state drives require at least 15–20% free space for garbage collection and wear leveling.\n` +
        `2. **Check Startup Apps:** Disable non-essential startup applications that consume RAM in the background.\n` +
        `3. **Storage Health (SMART):** Verify drive health is intact.\n\n` +
        `#### Recommended Next Path:\n` +
        `If the drive has bad sectors or memory is maxed out, a simple RAM or NVMe SSD upgrade can double effective speed without needing to purchase a new device.`,
      structuredAction: {
        likelyIssue: 'Storage Saturation or Thermal Throttling',
        nextSafeCheck: 'Free up at least 15% disk space and check Task Manager memory pressure.',
        recommendedPath: 'MAINTENANCE',
        confidence: 'Moderate',
        suggestedActions: [
          ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      }
    };
  }

  if (msg.includes('screen') || msg.includes('display') || msg.includes('flicker') || msg.includes('cracked')) {
    return {
      success: true,
      reply: `### Display Assessment for ${prodName}\n\n` +
        `Flickering, line artifacts, or display unresponsiveness usually stem from **loose display flex cables (EDP/MIPI)**, inverter power delivery issues, or physical glass lamination damage.\n\n` +
        `#### Simple Checks You Can Perform:\n` +
        `1. **Hinge Angle Test:** Slowly adjust the lid angle—if flickering changes with movement, the internal display cable is pinched or worn.\n` +
        `2. **External Monitor Test:** Connect to an external TV or monitor via HDMI/USB-C. If external image is clear, the GPU is healthy and only the panel requires attention.\n\n` +
        `#### Recommended Next Path:\n` +
        `Screen panel replacement by a ReTrace certified specialist preserves the original color calibration and syncs the replacement component code to your digital passport.`,
      structuredAction: {
        likelyIssue: 'Display Flex Ribbon or Panel Fault',
        nextSafeCheck: 'Connect to an external display to confirm GPU health.',
        recommendedPath: 'REPAIR',
        confidence: 'Moderate',
        suggestedActions: [
          ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      }
    };
  }

  if (msg.includes('wifi') || msg.includes('internet') || msg.includes('bluetooth') || msg.includes('network')) {
    return {
      success: true,
      reply: `### Wireless Connectivity Troubleshooting for ${prodName}\n\n` +
        `Intermittent disconnection is frequently linked to **driver power-management conflicts**, radio antenna disconnection inside the chassis, or 5GHz band channel congestion.\n\n` +
        `#### Simple Checks You Can Perform:\n` +
        `1. **Reset Network Adapter:** Turn Airplane mode on for 10 seconds, then off.\n` +
        `2. **Disable Power Saving on Wi-Fi Card:** In Device Manager > Network Adapter > Power Management, uncheck "Allow the computer to turn off this device to save power".\n` +
        `3. **Forget & Reconnect:** Forget the Wi-Fi network and reconnect.\n\n` +
        `#### Recommended Next Path:\n` +
        `If the adapter disappears from device manager entirely, the internal M.2 Wi-Fi card may have unseated and can be easily reseated or replaced for a minimal cost.`,
      structuredAction: {
        likelyIssue: 'Wireless Adapter Power State or Driver Conflict',
        nextSafeCheck: 'Toggle Airplane mode and disable adapter power saving.',
        recommendedPath: 'MAINTENANCE',
        confidence: 'High',
        suggestedActions: [
          { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
          { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
        ]
      }
    };
  }

  // Default general diagnosis
  return {
    success: true,
    reply: `### Technical Guidance for ${prodName}\n\n` +
      `Thank you for detailing the problem: "${data.message}".\n\n` +
      `#### Safe Initial Checks:\n` +
      `1. **Power Cycle:** Perform a full restart (hold power button 10 seconds) to clear volatile cache states.\n` +
      `2. **Observe Symptoms:** Note whether the problem occurs under specific workloads (gaming, multi-tasking) or consistently.\n` +
      `3. **Backup Critical Data:** If the issue seems hardware related, ensure your important files are backed up to cloud or external storage.\n\n` +
      `#### Circular Recommendation:\n` +
      `Always attempt component-level diagnosis before considering replacement. If software checks do not resolve the issue, a certified ReTrace technician can inspect the hardware and log verified findings to your product passport.`,
    structuredAction: {
      likelyIssue: 'Preliminary Hardware / System Diagnostic Required',
      nextSafeCheck: 'Perform a clean cold restart and verify whether symptoms persist under idle.',
      recommendedPath: 'REPAIR',
      confidence: 'Moderate',
      suggestedActions: [
        ...(data.productId ? [{ label: 'VIEW PRODUCT PASSPORT', action: 'passport', link: `/passport/${data.productId}` }] : []),
        { label: 'FIND A REPAIRER', action: 'repairer', link: '/repairers' },
        { label: 'ASK ANOTHER QUESTION', action: 'ask', link: '#' }
      ]
    }
  };
}
