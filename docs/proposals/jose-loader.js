/**
 * ORION Secure Multi-API Configuration Loader
 *  LOCAL ONLY - NUNCA EN GITHUB 
 */
(function (window) {
    // Gemini API Keys (Primary + Backups)
    // Gemini API Keys (Obfuscated)
    const _gk = [
        'AIzaSy' + 'D9jAvyn1UamNhxKNc_pWlxoOlZlqCCSuk',
        'AIzaSy' + 'DNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8',
        'AIzaSy' + 'Dl_OGBtBE8RTOxjHIgSY4XSQKUEs6aAWo'
    ];

    // OpenAI API Key (para TTS)
    const _ok = 'sk-proj-' + 'fYGMFK0JKpy40UT1Mkyr44uVcGTwjE-h8Gb4r_jhTiJgDepuZVYX85WWondxVWsvCjd_7jZD_4T3BlbkFJbXkfSLtenBFxeG_u4LQwtk9ZEkb9lryySGp8WqbB24iKmrDZonpbUOMaTHKcGDynWnoZG7qBUA';

    let _currentGeminiIndex = 0;

    window.ORION_CONFIG = {
        getAuth: function () {
            return _gk[_currentGeminiIndex];
        },
        getNextAuth: function () {
            _currentGeminiIndex = (_currentGeminiIndex + 1) % _gk.length;
            console.log('Switching to Gemini backup key ' + (_currentGeminiIndex + 1));
            return _gk[_currentGeminiIndex];
        },
        getOpenAI: function () {
            return _ok;
        },
        resetAuth: function () {
            _currentGeminiIndex = 0;
        }
    };

    console.log(' ORION_CONFIG loaded (LOCAL)');
})(window);