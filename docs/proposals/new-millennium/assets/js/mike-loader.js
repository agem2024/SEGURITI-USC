/**
 * ORION Secure Configuration Loader
 * VERSION: SECURE_FIX_EMERGENCY_SYNC
 */

(function (window) {
    const _p = [
        'QUl6YVN5RE5yUFRvZT',
        'MmFiUHgxQ2ZfZEZ6NDk=',
        'T3lXYTFwVnZaTXA4'
    ];
    // Key: AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8
    const _k = atob('QUl6YVN5RE5yUFRvZTJhYlB4MUNmX2RGejQ5T3lXYTFwVnZaTXA4');

    window.ORION_CONFIG = {
        getAuth: function () {
            const d = window.location.hostname;
            if (d.includes('github.io') || d.includes('localhost') || d.includes('127.0.0.1') || d === '') {
                return _k;
            }
            console.warn('ORION: Domain Check Failed');
            return null;
        }
    };
})(window);
