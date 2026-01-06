/**
 * ORION Secure Configuration Loader
 * Handles API Key reconstruction and environment validation.
 * Ensures keys are not stored in plaintext in the main codebase.
 */

(function (window) {
    const _p = [
        'QUl6YVN5RDlqQXZ5bjFVYW1',
        'OaHhLTmNfcFdseG9PbF',
        'ZscSBDQ1N1aw=='
    ];

    function _d(s) {
        return atob(s.replace(/ /g, ''));
    }

    const _k = _p.map(_d).join('');

    // Expose restricted config object
    window.ORION_CONFIG = {
        getAuth: function () {
            // Optional: Domain Check (Client-side only, not fully secure but deters dragging)
            const d = window.location.hostname;
            if (d.includes('github.io') || d.includes('localhost') || d.includes('127.0.0.1')) {
                return _k;
            }
            console.warn('ORION: Domain not authorized for AI features.');
            return null; // Or return _k if you want it strictly everywhere
        }
    };
})(window);
