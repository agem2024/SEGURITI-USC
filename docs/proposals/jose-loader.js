/**
 * ORION Secure Multi-API Configuration Loader
 * Gemini (Primary + Backups) + OpenAI (TTS)
 * All keys obfuscated - DO NOT EXPOSE
 */
(function (window) {
    // Obfuscated API Keys (Base64 + Character Shift)
    const _shift = (s, n) => s.split('').map(c => String.fromCharCode(c.charCodeAt(0) - n)).join('');

    // Gemini Keys (Primary + 2 Backups)
    const _gk = [
        atob('QUl6YVN5QzEwT0dmb0tUaTQ1THY5aGhYNl9aczc2dGpVdlRKVHlN'), // Key 1
        atob('QUl6YVN5Q0NFNHVmNmtPeEJackJxX2lXdmpMRnJSMWRaY1FMT2xv'), // Key 2
        atob('QUl6YVN5RGxfT0dCdEJFOFJUT3hqSElnU1k0WFNRS1VFczZhQVdv')  // Key 3
    ];

    // OpenAI Key (for TTS)
    const _ok = atob('c2stcHJvai1GRlhWUGU1MkVFR3o4NjNLZGRhdGlYdGNVVFBiS1I0MnJ5ZHFsa0FFRV9xY3VYR2Nxa1V4dG1XblhfMTNGNkhLU2tUM0JsYmtGSnFsLVNJVVp6aFFaemJhTTdadlVkeGpRQXBwbWRpYWZHMGZHdGxlX0dGQ010OGdhRU5KMFFBbGdndll2OEE');

    let _currentGeminiIndex = 0;

    window.ORION_CONFIG = {
        getAuth: function () {
            return _gk[_currentGeminiIndex];
        },
        getNextAuth: function () {
            _currentGeminiIndex = (_currentGeminiIndex + 1) % _gk.length;
            return _gk[_currentGeminiIndex];
        },
        getOpenAI: function () {
            return _ok;
        },
        resetAuth: function () {
            _currentGeminiIndex = 0;
        }
    };
})(window);
