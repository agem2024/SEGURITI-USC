/**
 * ORION Secure Configuration Loader
 * Restored for Jose/Chela/Mike compatibility.
 */
(function (window) {
    // Valid API Key (Base64)
    const _k = atob('QUl6YVN5RE5yUFRvZTJhYlB4MUNmX2RGejQ5T3lXYTFwVnZaTXA4');

    window.ORION_CONFIG = {
        getAuth: function () {
            return _k;
        }
    };
})(window);
