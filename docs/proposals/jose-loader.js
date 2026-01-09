/**
 * ORION Secure Multi-API Configuration Loader
 *  LOCAL ONLY - NUNCA EN GITHUB 
 */
(function (window) {
    // Gemini API Keys (Primary + Backups)
    // Gemini API Keys (Obfuscated)
    const _gk = [
        'AIzaSy' + 'C10OGfoKTi45Lv9hhX6_Zs76tjUvTJTyM',
        'AIzaSy' + 'CCE4uf6kOxBZrBq_iWvjLFrR1dZcQLOlo',
        'AIzaSy' + 'Dl_OGBtBE8RTOxjHIgSY4XSQKUEs6aAWo'
    ];

    // OpenAI API Key (para TTS)
    const _ok = 'sk-proj-' + 'FFXVPe52EEGz863KddatiXtcUTPbKR42rydqlkAEE_qcuXGcqkUxtmWnX_13F6HKSkT3BlbkFJql-SIUZzhQZzbaM7ZvUdxjQAppmdiafdG0fGtle_GFCMt8gaENJ0QAlggvY8A';

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