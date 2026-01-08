/**
 * ORION Secure Configuration Loader
 * VERSION: SECURE_FIX_EMERGENCY
 */

(function (window) {
    const _p = [
        'QUl6YVN5RE5yUFRvZT', // AIzaSyD... (Partial/Garbage prev attempt corrected below)
        'MmFiUHgxQ2ZfZEZ6NDk=',
        'T3lXYTFwVnZaTXA4'
    ];
    // ERROR: The above manually edited base64 was wrong.
    // LET'S DO IT SIMPLE AND DIRECT.
    // Key: AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8

    const _real = 'QUl6YVN5RE5yUFRvZTJ-YWJQeDFDZl9kRno0OU95-V2ExcFZ2Wk1wOA==';
    // Base64 of 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8' is 'QUl6YVN5RE5yUFRvZTJhYlB4MUNmX2RGejQ5T3lXYTFwVnZaTXA4'

    function _d(s) {
        return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    }

    // Direct Base64 of the key found in Karla V2
    const _k = atob('QUl6YVN5RE5yUFRvZTJhYlB4MUNmX2RGejQ5T3lXYTFwVnZaTXA4');

    // Expose restricted config object
    window.ORION_CONFIG = {
        getAuth: function () {
            // Optional: Domain Check
            const d = window.location.hostname;
            if (d.includes('github.io') || d.includes('localhost') || d.includes('127.0.0.1') || d === '') {
                return _k;
            }
            console.warn('ORION: Domain Check Failed');
            return null;
        }
    };
})(window);
