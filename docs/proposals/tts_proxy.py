"""
OpenAI TTS Proxy Server
Bypass CORS para llamadas desde el navegador
"""
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from openai import OpenAI
import google.generativeai as genai
import io
import os

app = Flask(__name__)
CORS(app)  # Permitir CORS desde cualquier origen

# OpenAI client (usa variable de entorno o archivo local)
openai_client = None
# Gemini client
gemini_model = None

def init_apis():
    global openai_client, gemini_model
    
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
        openai_client = OpenAI(api_key=api_key)
        print("✅ OpenAI client initialized")
    else:
        print("❌ No OpenAI API key found! (Check Render Environment Variables)")
    
    # Initialize Gemini
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        genai.configure(api_key=gemini_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini client initialized")
    else:
        print("❌ No Gemini API key found! (Check Render Environment Variables)")

# Initialize immediately for Gunicorn
init_apis()


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
        response = openai_client.audio.speech.create(
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

@app.route('/chat', methods=['POST'])
def chat():
    """
    Endpoint proxy para Gemini Chat
    Body: { "message": "...", "history": [] }
    """
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not gemini_model:
            return {"error": "Gemini not configured"}, 500
        
        # Llamada a Gemini
        response = gemini_model.generate_content(message)
        
        return jsonify({
            "response": response.text
        })
        
    except Exception as e:
        print(f"❌ Chat Error: {e}")
        return {"error": str(e)}, 500

@app.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "service": "ORION AI Proxy (TTS + Chat)"}

if __name__ == '__main__':
    # Already initialized via init_apis() at module level
    print("🚀 ORION AI Proxy server running on http://localhost:5000")
    print("📡 Endpoints:")
    print("   POST /tts   - Text-to-Speech")
    print("   POST /chat  - Gemini Chat")
    app.run(host='0.0.0.0', port=5000, debug=True)
