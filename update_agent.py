import os
import requests
import json

API_KEY = 'sk_d87ef2465ceb54e17340e109a5efb42738bfe27b95a8e611'
AGENT_ID = 'agent_9601m3y15dtzehf939hej3xyqz5n'
url = f'https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}'

headers = {
    'xi-api-key': API_KEY,
    'Content-Type': 'application/json'
}

# Fetch the existing agent first to see the schema
resp = requests.get(url, headers=headers)
print('GET:', resp.status_code)
agent_data = resp.json()

# Now patch it
payload = {
    'conversation_config': agent_data.get('conversation_config', {})
}

# Update the prompt
if 'agent' not in payload['conversation_config']:
    payload['conversation_config']['agent'] = {}
if 'prompt' not in payload['conversation_config']['agent']:
    payload['conversation_config']['agent']['prompt'] = {}

payload['conversation_config']['agent']['prompt']['prompt'] = """You are the voice AI assistant for Retrace, an AI-powered product lifecycle and recovery platform.

You are having a real-time spoken conversation with the user.

Listen carefully to every user utterance and respond specifically to what the user has said.

Do not assume the user's question.

Do not generate a response until a meaningful user utterance has been received.

If the transcript is incomplete or unclear, briefly ask the user to repeat or clarify.

Never pretend that you heard something when no usable transcript was received.

Keep spoken responses concise, natural, and conversational.

Do not use Markdown, bullet-heavy formatting, or long written explanations in voice responses.

For simple questions, answer directly.

For complex questions, explain them conversationally in short sections.

Maintain context across the conversation.

If the user interrupts you, stop your current response and listen to the user.

After answering, remain ready for the user's next turn."""

# Update turn config
if 'turn' not in payload['conversation_config']:
    payload['conversation_config']['turn'] = {}
    
payload['conversation_config']['turn']['turn_timeout'] = 1.0

patch_resp = requests.patch(url, headers=headers, json=payload)
print('PATCH:', patch_resp.status_code)
print(patch_resp.text)
