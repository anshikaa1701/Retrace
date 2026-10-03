import os
import requests
import logging

logger = logging.getLogger(__name__)

# Sarah voice, supported on Free tier
DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL" 

def generate_speech(text, voice_id=DEFAULT_VOICE_ID):
    """
    Sends text to ElevenLabs for Text-to-Speech generation and returns the raw audio data.
    Ensures the API key is NEVER exposed to the frontend.
    """
    if not text or not isinstance(text, str):
        logger.error("Invalid text provided to ElevenLabs service.")
        return None

    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key or api_key == "your_elevenlabs_api_key_here":
        logger.error("ELEVENLABS_API_KEY is not configured or is set to placeholder.")
        return None

    # Safety limits: Prevent abuse/massive cost by truncating excessively long text
    max_length = 500
    if len(text) > max_length:
        text = text[:max_length]
        logger.warning(f"Text truncated to {max_length} characters for cost safety.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        error_details = e.response.text if e.response else str(e)
        with open("elevenlabs_error.txt", "w") as f:
            f.write(error_details)
        print(f"[ELEVENLABS DEBUG] 400 Error Details: {error_details}")
        logger.error(f"ElevenLabs API Error: {str(e)}")
        # Do not leak the detailed response text that might contain secrets
        return None
