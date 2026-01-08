    async _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;

        const cleanText = text.replace(/[*#]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');
        
        // Try OpenAI TTS via proxy first (NATURAL VOICE)
        try {
            const response = await fetch('http://localhost:5000/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: cleanText,
                    language: this.language
                })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                await audio.play();
                audio.onended = () => URL.revokeObjectURL(audioUrl);
                console.log(' OpenAI TTS (HD):', this.language);
                return; // Success
            }
        } catch (e) {
            console.log('TTS proxy offline, using Web Speech fallback');
        }

        // Fallback: Web Speech API
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.selectedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 0.95;
        utterance.volume = 1.0;
        utterance.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        this.synth.speak(utterance);
    }

    setLanguage(lang) {
        this.language = lang;
        this._loadVoices(); // Reload voices for new language
        console.log('Mario language switched to:', lang);
        
        // Update welcome message
        const welcomeMsg = this.language === 'es' ?
            Hola! Soy Mario, su Especialista de Operaciones IA. Veo que sus dispatchers manejan 50 llamadas diarias manualmente. Le gustaría ver cómo podemos automatizar eso a cero tiempos de espera? :
            Hello! I'm Mario, your AI Operations Specialist. I observe that your dispatchers handle 50 calls a day manually. Would you like to see how we can automate that to zero hold times?;
        
        // Update first message if chat is open
        const firstMsg = document.querySelector('#mario-messages .mario-message');
        if (firstMsg) {
            firstMsg.textContent = welcomeMsg;
        }
    }
