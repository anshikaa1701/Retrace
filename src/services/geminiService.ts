export interface StructuredActionCard {
  likelyIssue: string;
  nextSafeCheck: string;
  recommendedPath: 'REPAIR' | 'RESALE' | 'RECOVERY' | 'MAINTENANCE' | 'PROFESSIONAL_REPAIR';
  confidence: 'High' | 'Moderate' | 'Low';
  suggestedActions: Array<{
    label: string;
    action: string;
    link: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  structuredAction?: StructuredActionCard | null;
  isError?: boolean;
}

export interface ProductContextPayload {
  brand?: string;
  model?: string;
  condition?: string;
  repairCount?: number;
  verifiedRepairsCount?: number;
  lastRepair?: string;
  serialNumber?: string;
}

export interface SendMessageOptions {
  message: string;
  productId?: string;
  productContext?: ProductContextPayload;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

export interface AiApiResponse {
  success: boolean;
  reply: string;
  structuredAction?: StructuredActionCard | null;
  error?: string;
}

/**
 * ReTrace Gemini Service Abstraction
 * Routes all requests via server-side endpoint POST /api/ai/chat to prevent exposing Gemini API keys
 */
export const geminiService = {
  async sendChatMessage(options: SendMessageOptions): Promise<AiApiResponse> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: options.message,
          productId: options.productId,
          productContext: options.productContext,
          history: options.history
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          return {
            success: false,
            reply: 'ReTrace AI is experiencing high traffic. Please wait a moment before asking another question.',
            structuredAction: null
          };
        }
        return {
          success: false,
          reply: 'ReTrace AI is temporarily unavailable. Please try again in a moment.',
          structuredAction: null
        };
      }

      const data: AiApiResponse = await response.json();
      return data;
    } catch (err) {
      console.warn('[geminiService] Backend fetch failure:', err);
      return {
        success: false,
        reply: 'ReTrace AI is temporarily unavailable. Please check your network connection and try again.',
        structuredAction: null
      };
    }
  }
};
