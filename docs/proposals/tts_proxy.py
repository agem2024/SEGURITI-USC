"""
OpenAI TTS Proxy Server
Bypass CORS para llamadas desde el navegador
"""
from flask import Flask, request, send_file
from flask_cors import CORS
from openai import OpenAI
import io
import os

app = Flask(__name__)
CORS(app)  # Permitir CORS desde cualquier origen

# OpenAI client (usa variable de entorno o archivo local)
client = None

def init_openai():
    global client
    
    # Production: use environment variable
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        # Development: try to read from local jose-loader.js
        try:
            with open('jose-loader.js', 'r', encoding='utf-8') as f:
                content = f.read()
                if 'TU_OPENAI_KEY' not in content:
                    import re
                    match = re.search(r"const _ok = ['\"]([^'\"]+)['\"]", content)
                    if match:
                        api_key = match.group(1)
                        print("✅ OpenAI client initialized from jose-loader.js (dev)")
        except:
            pass
    
    if api_key:
        client = OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized")
    else:
        print("❌ No OpenAI API key found!")
        raise Exception("OPENAI_API_KEY required")


@app.route('/tts', methods=['POST'])
def text_to_speech():
    """
    Endpoint proxy para OpenAI TTS
    Body: { "text": "...", "language": "en|es" }
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'en')
        
        # Voces naturales: coral (neutral), marin (mejor calidad)
        voice = 'coral' if language == 'es' else 'marin'
        
        # Instrucciones para voz natural
        instructions = {
            'es': 'Habla de forma natural, conversacional y cálida en español latino neutro.',
            'en': 'Speak naturally, conversationally and warmly in California English.'
        }.get(language, '')
        
        # Llamada a OpenAI TTS
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts",
            voice=voice,
            input=text,
            instructions=instructions,
            response_format="mp3",
            speed=1.0
        )
        
        # Convertir a bytes para enviar
        audio_bytes = io.BytesIO(response.content)
        audio_bytes.seek(0)
        
        return send_file(
            audio_bytes,
            mimetype='audio/mpeg',
            as_attachment=False
        )
        
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return {"error": str(e)}, 500

@app.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "service": "OpenAI TTS Proxy"}

if __name__ == '__main__':
    init_openai()
    print("🚀 TTS Proxy server running on http://localhost:5000")
    print("📡 Endpoint: POST http://localhost:5000/tts")
    app.run(host='0.0.0.0', port=5000, debug=True)
