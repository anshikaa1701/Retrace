import json
import time
import re
import os
import requests
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

# In-memory rate limiting map: ip -> timestamps[]
rate_limit_map = {}
RATE_LIMIT_WINDOW_SEC = 60  # 1 minute
MAX_REQUESTS_PER_WINDOW = 25  # 25 requests per minute

SYSTEM_INSTRUCTION = """You are ReTrace AI, a technical product assistant.

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

The purpose is to help the user decide the next safe step, not to replace a professional repair technician."""

# Safety keyword guardrails
DANGEROUS_PATTERNS = [
    re.compile(r"(?:swollen|bulging|puffed|expanding|bloated)\s*.*(?:battery|cell)", re.IGNORECASE),
    re.compile(r"(?:battery|cell)\s*.*(?:swollen|bulging|puffed|expanding|bloated)", re.IGNORECASE),
    re.compile(r"(?:puncture|pierce|stab|needle|poke)\s*.*(?:battery|cell)", re.IGNORECASE),
    re.compile(r"(?:battery|cell)\s*.*(?:puncture|pierce|stab|needle|poke)", re.IGNORECASE),
    re.compile(r"(?:battery|device|laptop|phone)\s*.*(?:smoke|smoking|fumes)", re.IGNORECASE),
    re.compile(r"(?:smoke|smoking|fumes)\s*.*(?:battery|device|laptop|phone)", re.IGNORECASE),
    re.compile(r"burning\s*(?:smell|odor|plastic|circuit)", re.IGNORECASE),
    re.compile(r"sparking|sparks|electrical\s*arc", re.IGNORECASE),
    re.compile(r"electric\s*shock|shocked\s*me", re.IGNORECASE),
    re.compile(r"fire|flames|ignited|caught\s*fire|exploded|exploding", re.IGNORECASE),
    re.compile(r"microwave.*capacitor", re.IGNORECASE),
    re.compile(r"bypass.*fuse", re.IGNORECASE)
]

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
    return ip

@csrf_exempt
def handle_ai_chat_request(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    # Rate Limiting
    client_ip = get_client_ip(request)
    now = time.time()
    
    timestamps = rate_limit_map.get(client_ip, [])
    valid_timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SEC]

    if len(valid_timestamps) >= MAX_REQUESTS_PER_WINDOW:
        return JsonResponse({
            'error': 'Too Many Requests',
            'reply': 'ReTrace AI is experiencing high traffic. Please wait a moment before asking another question.'
        }, status=429)

    valid_timestamps.append(now)
    rate_limit_map[client_ip] = valid_timestamps

    try:
        body_unicode = request.body.decode('utf-8')
        if len(body_unicode) > 100 * 1024: # Protect against oversized payload
            return JsonResponse({'error': 'Payload too large'}, status=413)
            
        data = json.loads(body_unicode) if body_unicode else {}
        user_message = data.get('message', '').strip()

        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # Check Immediate Safety Guardrails
        is_dangerous = any(pat.search(user_message) for pat in DANGEROUS_PATTERNS)
        if is_dangerous:
            return JsonResponse({
                'success': True,
                'reply': (
                    "⚠️ **CRITICAL SAFETY WARNING: STOP USE IMMEDIATELY**\n\n"
                    "This issue indicates a potential fire, chemical, or electrical hazard. **Do not attempt to puncture, charge, or open the device.**\n\n"
                    "1. **Disconnect from power** immediately if safe to do so.\n"
                    "2. **Move the device** to a non-flammable surface (e.g. tile or concrete), away from heat and people.\n"
                    "3. **Contact a certified ReTrace repair specialist** or authorized hazardous electronics disposal center immediately for safe handling."
                ),
                'structuredAction': {
                    'likelyIssue': 'Severe Battery / Electrical Hardware Hazard',
                    'nextSafeCheck': 'Cease all charging and power immediately; store on a fire-safe surface.',
                    'recommendedPath': 'PROFESSIONAL_REPAIR',
                    'confidence': 'High',
                    'suggestedActions': [
                        {'label': 'FIND CERTIFIED SPECIALIST', 'action': 'repairer', 'link': '/repairers'},
                        {'label': 'VIEW EMERGENCY PROTOCOL', 'action': 'protocol', 'link': '/repairers'}
                    ]
                }
            })

        # Fetch from Google Gemini if API Key is available
        gemini_api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('VITE_GEMINI_API_KEY')

        if gemini_api_key:
            try:
                response = call_gemini_api(gemini_api_key, data)
                return JsonResponse(response)
            except Exception as gemini_err:
                print('[ReTrace AI] Gemini API call error, falling back to local technical engine:', gemini_err)
                # Fall through to local intelligent fallback

        # Local Intelligent Technical Fallback (Compliant with ReTrace system instruction)
        fallback_response = generate_local_technical_diagnosis(data)
        return JsonResponse(fallback_response)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as err:
        print('[ReTrace AI Backend Error]:', err)
        return JsonResponse({
            'success': False,
            'reply': 'ReTrace AI is temporarily unavailable. Please try again in a moment.',
            'structuredAction': None
        })

def call_gemini_api(api_key, data):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    # Build context prefix if product context is attached
    context_prompt = ''
    product_context = data.get('productContext', {})
    
    if product_context:
        context_prompt = (
            f"[PRODUCT CONTEXT AVAILABLE ON RETRACE]\n"
            f"Brand: {product_context.get('brand', 'Unknown')}\n"
            f"Model: {product_context.get('model', 'Unknown')}\n"
            f"Condition: {product_context.get('condition', 'Active')}\n"
            f"ReTrace ID: {data.get('productId', 'N/A')}\n"
            f"Verified Repairs: {product_context.get('verifiedRepairsCount', 0)}\n"
            f"Last Maintenance: {product_context.get('lastRepair', 'None recorded')}\n"
            f"---\n"
        )

    prompt_text = (
        f"{context_prompt}User Problem: {data.get('message')}\n\n"
        "Please provide:\n"
        "1. Concise explanation of the likely cause.\n"
        "2. 2-3 simple, safe non-invasive checks the user can do at home.\n"
        "3. Clear recommendation whether professional repair or replacement is appropriate.\n"
        "4. Conclude with a JSON metadata block formatted exactly as:\n"
        "```json\n"
        "{\n"
        '  "likelyIssue": "Brief issue title",\n'
        '  "nextSafeCheck": "One simple check",\n'
        '  "recommendedPath": "REPAIR" | "RESALE" | "RECOVERY" | "MAINTENANCE",\n'
        '  "confidence": "High" | "Moderate" | "Low"\n'
        "}\n"
        "```"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt_text}]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}]
        },
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 800
        }
    }

    response = requests.post(url, headers={'Content-Type': 'application/json'}, json=payload)
    response.raise_for_status()
    
    result = response.json()
    raw_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

    # Extract JSON action card if present
    clean_reply = raw_text
    structured_action = None

    json_match = re.search(r'```json\s*([\s\S]*?)\s*```', raw_text)
    if json_match:
        try:
            parsed = json.loads(json_match.group(1))
            product_id = data.get('productId')
            suggested_actions = []
            if product_id:
                suggested_actions.append({'label': 'VIEW PRODUCT PASSPORT', 'action': 'passport', 'link': f'/passport/{product_id}'})
            suggested_actions.extend([
                {'label': 'FIND A REPAIRER', 'action': 'repairer', 'link': '/repairers'},
                {'label': 'ASK ANOTHER QUESTION', 'action': 'ask', 'link': '#'}
            ])
            
            structured_action = {
                'likelyIssue': parsed.get('likelyIssue', 'Hardware Diagnostic Assessment'),
                'nextSafeCheck': parsed.get('nextSafeCheck', 'Monitor device operating temperature and battery status.'),
                'recommendedPath': parsed.get('recommendedPath', 'REPAIR'),
                'confidence': parsed.get('confidence', 'Moderate'),
                'suggestedActions': suggested_actions
            }
            # Remove JSON block from markdown message
            clean_reply = re.sub(r'```json[\s\S]*?```', '', raw_text).strip()
        except json.JSONDecodeError:
            pass

    return {
        'success': True,
        'reply': clean_reply or 'Troubleshooting assessment generated.',
        'structuredAction': structured_action
    }

def generate_local_technical_diagnosis(data):
    msg = data.get('message', '').lower()
    prod = data.get('productContext', {})
    
    brand = prod.get('brand', '')
    model = prod.get('model', '')
    prod_name = f"{brand} {model}".strip() if brand or model else 'your device'
    product_id = data.get('productId')
    
    def get_actions():
        actions = []
        if product_id:
            actions.append({'label': 'VIEW PRODUCT PASSPORT', 'action': 'passport', 'link': f'/passport/{product_id}'})
        actions.extend([
            {'label': 'FIND A REPAIRER', 'action': 'repairer', 'link': '/repairers'},
            {'label': 'ASK ANOTHER QUESTION', 'action': 'ask', 'link': '#'}
        ])
        return actions

    if any(keyword in msg for keyword in ['heat', 'hot', 'fan', 'thermal']):
        return {
            'success': True,
            'reply': (
                f"### Likely Cause for Overheating on {prod_name}\n\n"
                "Elevated thermals typically stem from **dust blockage in the cooling fins**, dried thermal compound between the silicon die and heatpipe, or continuous high CPU background processes.\n\n"
                "#### Simple Checks You Can Perform:\n"
                "1. **Inspect Exhaust Vents:** Check air vents with a flashlight to verify there is no visible lint or particulate blockage.\n"
                "2. **Check Process Load:** Open Task Manager (Windows) or Activity Monitor (macOS) to identify background tasks running above 80% CPU usage.\n"
                "3. **Elevate Surface:** Ensure the device rests on a hard, flat surface rather than a blanket or lap.\n\n"
                "#### Recommended Next Path:\n"
                "If the fan continues to run at maximum RPM even at idle, a **bench ultrasonic dust cleanout and fresh Arctic thermal paste application** by a certified technician is recommended. Repairing the cooling system extends device longevity by 2–4 years and is far more economical than premature replacement."
            ),
            'structuredAction': {
                'likelyIssue': 'Thermal Paste Degradation & Heatsink Obstruction',
                'nextSafeCheck': 'Inspect air exhaust vents and check Task Manager for runaway CPU processes.',
                'recommendedPath': 'REPAIR',
                'confidence': 'High',
                'suggestedActions': get_actions()
            }
        }

    if any(keyword in msg for keyword in ['battery', 'drain', 'charge', 'power']):
        return {
            'success': True,
            'reply': (
                f"### Battery & Power Analysis for {prod_name}\n\n"
                "Lithium-ion cells naturally degrade with charge cycles and heat exposure. Common causes of rapid drain include chemical aging, background location services, or DC power port contact resistance.\n\n"
                "#### Simple Checks You Can Perform:\n"
                "1. **Check Battery Health:** In Settings > Battery, inspect overall capacity health percentage.\n"
                "2. **Inspect Cable & Connector:** Check the charging cable pins for bent contacts or lint buildup in the port (use a dry wooden toothpick only, never metal).\n"
                "3. **Test with Verified Power Brick:** Try an alternate OEM-certified charger.\n\n"
                "#### Recommended Next Path:\n"
                "If battery health is below 80% or the device unexpectedly shuts down at 20–30%, an **OEM battery replacement** will restore full-day runtime. ReTrace verified technicians can log the new cycle count to your device passport."
            ),
            'structuredAction': {
                'likelyIssue': 'Lithium Cell Capacity Degradation',
                'nextSafeCheck': 'Check battery health percentage in System Settings and inspect port for lint.',
                'recommendedPath': 'REPAIR',
                'confidence': 'High',
                'suggestedActions': get_actions()
            }
        }

    if any(keyword in msg for keyword in ['slow', 'lag', 'freeze', 'performance']):
        return {
            'success': True,
            'reply': (
                f"### Performance Diagnostic for {prod_name}\n\n"
                "Performance slowdowns are commonly caused by **storage drive exhaustion (above 85% capacity)**, fragmented background indexing, insufficient RAM memory pressure, or thermal throttling.\n\n"
                "#### Simple Checks You Can Perform:\n"
                "1. **Check Free Storage:** Solid-state drives require at least 15–20% free space for garbage collection and wear leveling.\n"
                "2. **Check Startup Apps:** Disable non-essential startup applications that consume RAM in the background.\n"
                "3. **Storage Health (SMART):** Verify drive health is intact.\n\n"
                "#### Recommended Next Path:\n"
                "If the drive has bad sectors or memory is maxed out, a simple RAM or NVMe SSD upgrade can double effective speed without needing to purchase a new device."
            ),
            'structuredAction': {
                'likelyIssue': 'Storage Saturation or Thermal Throttling',
                'nextSafeCheck': 'Free up at least 15% disk space and check Task Manager memory pressure.',
                'recommendedPath': 'MAINTENANCE',
                'confidence': 'Moderate',
                'suggestedActions': get_actions()
            }
        }

    if any(keyword in msg for keyword in ['screen', 'display', 'flicker', 'cracked']):
        return {
            'success': True,
            'reply': (
                f"### Display Assessment for {prod_name}\n\n"
                "Flickering, line artifacts, or display unresponsiveness usually stem from **loose display flex cables (EDP/MIPI)**, inverter power delivery issues, or physical glass lamination damage.\n\n"
                "#### Simple Checks You Can Perform:\n"
                "1. **Hinge Angle Test:** Slowly adjust the lid angle—if flickering changes with movement, the internal display cable is pinched or worn.\n"
                "2. **External Monitor Test:** Connect to an external TV or monitor via HDMI/USB-C. If external image is clear, the GPU is healthy and only the panel requires attention.\n\n"
                "#### Recommended Next Path:\n"
                "Screen panel replacement by a ReTrace certified specialist preserves the original color calibration and syncs the replacement component code to your digital passport."
            ),
            'structuredAction': {
                'likelyIssue': 'Display Flex Ribbon or Panel Fault',
                'nextSafeCheck': 'Connect to an external display to confirm GPU health.',
                'recommendedPath': 'REPAIR',
                'confidence': 'Moderate',
                'suggestedActions': get_actions()
            }
        }

    if any(keyword in msg for keyword in ['wifi', 'internet', 'bluetooth', 'network']):
        return {
            'success': True,
            'reply': (
                f"### Wireless Connectivity Troubleshooting for {prod_name}\n\n"
                "Intermittent disconnection is frequently linked to **driver power-management conflicts**, radio antenna disconnection inside the chassis, or 5GHz band channel congestion.\n\n"
                "#### Simple Checks You Can Perform:\n"
                "1. **Reset Network Adapter:** Turn Airplane mode on for 10 seconds, then off.\n"
                "2. **Disable Power Saving on Wi-Fi Card:** In Device Manager > Network Adapter > Power Management, uncheck \"Allow the computer to turn off this device to save power\".\n"
                "3. **Forget & Reconnect:** Forget the Wi-Fi network and reconnect.\n\n"
                "#### Recommended Next Path:\n"
                "If the adapter disappears from device manager entirely, the internal M.2 Wi-Fi card may have unseated and can be easily reseated or replaced for a minimal cost."
            ),
            'structuredAction': {
                'likelyIssue': 'Wireless Adapter Power State or Driver Conflict',
                'nextSafeCheck': 'Toggle Airplane mode and disable adapter power saving.',
                'recommendedPath': 'MAINTENANCE',
                'confidence': 'High',
                'suggestedActions': [
                    {'label': 'FIND A REPAIRER', 'action': 'repairer', 'link': '/repairers'},
                    {'label': 'ASK ANOTHER QUESTION', 'action': 'ask', 'link': '#'}
                ]
            }
        }

    # Default general diagnosis
    return {
        'success': True,
        'reply': (
            f"### Technical Guidance for {prod_name}\n\n"
            f"Thank you for detailing the problem: \"{data.get('message', '')}\".\n\n"
            "#### Safe Initial Checks:\n"
            "1. **Power Cycle:** Perform a full restart (hold power button 10 seconds) to clear volatile cache states.\n"
            "2. **Observe Symptoms:** Note whether the problem occurs under specific workloads (gaming, multi-tasking) or consistently.\n"
            "3. **Backup Critical Data:** If the issue seems hardware related, ensure your important files are backed up to cloud or external storage.\n\n"
            "#### Circular Recommendation:\n"
            "Always attempt component-level diagnosis before considering replacement. If software checks do not resolve the issue, a certified ReTrace technician can inspect the hardware and log verified findings to your product passport."
        ),
        'structuredAction': {
            'likelyIssue': 'Preliminary Hardware / System Diagnostic Required',
            'nextSafeCheck': 'Perform a clean cold restart and verify whether symptoms persist under idle.',
            'recommendedPath': 'REPAIR',
            'confidence': 'Moderate',
            'suggestedActions': get_actions()
        }
    }


@csrf_exempt
def handle_ai_tts_request(request):
    """
    Secure backend proxy for ElevenLabs TTS.
    Receives text from the frontend, securely generates audio via the service,
    and returns it as a streaming/binary response without exposing the API key.
    """
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    # Re-use the existing rate limiter to prevent abuse
    client_ip = get_client_ip(request)
    now = time.time()
    
    timestamps = rate_limit_map.get(client_ip, [])
    valid_timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SEC]

    # Stricter rate limiting for TTS (e.g. 5 requests per minute) to prevent cost overrun
    if len(valid_timestamps) >= 5:
        return JsonResponse({
            'error': 'Too Many Requests',
            'reply': 'TTS limit reached. Please wait a moment.'
        }, status=429)

    valid_timestamps.append(now)
    rate_limit_map[client_ip] = valid_timestamps

    try:
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)
        text = data.get('text', '').strip()

        if not text:
            return JsonResponse({'error': 'No text provided'}, status=400)

        # Import the secure service
        from .services.elevenlabs_service import generate_speech
        
        audio_content = generate_speech(text)
        
        if not audio_content:
            return JsonResponse({'error': 'Failed to generate speech'}, status=500)
            
        from django.http import HttpResponse
        return HttpResponse(audio_content, content_type='audio/mpeg')

    except Exception as e:
        # Do not expose internal error details to the frontend
        return JsonResponse({'error': 'An internal error occurred during TTS processing'}, status=500)

@csrf_exempt
def handle_elevenlabs_token(request):
    """
    Secure backend proxy to get ElevenLabs signed URL for Conversational AI.
    """
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
        
    api_key = os.environ.get('ELEVENLABS_API_KEY')
    agent_id = os.environ.get('ELEVENLABS_AGENT_ID')
    
    if not api_key or not agent_id:
        return JsonResponse({'error': 'ElevenLabs credentials not configured'}, status=500)
        
    url = f'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id={agent_id}'
    
    try:
        response = requests.get(url, headers={'xi-api-key': api_key})
        response.raise_for_status()
        return JsonResponse(response.json())
    except Exception as e:
        print('[ElevenLabs Token Error]', e)
        return JsonResponse({'error': 'Failed to get signed url'}, status=500)
