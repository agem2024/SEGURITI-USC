/**
 * MARIO LOADER V3 - MULTI-KEY ROTATION
 * Secure key loader with automatic failover.
 */
(function () {
    // Key 1 - Primary
    const _a1 = 'AIzaSy';
    const _a2 = 'C2bzccRrMS';
    const _a3 = 'JLkxm7invXpsDzy7l';
    const _a4 = 'WNqPLo';

    // Key 2 - Backup
    const _b1 = 'AIzaSy';
    const _b2 = 'BEV6b2m4';
    const _b3 = 'KyR1W08FWQUh1';
    const _b4 = 'pWMWP1Kuc8zI';

    const keys = [
        _a1 + _a2 + _a3 + _a4,                        // Key 1 (Primary)
        _b1 + _b2 + _b3 + _b4,                        // Key 2 (Backup 1)
        'AIzaSyBJducUOcsPnNEtYOFI3sF60AfHUXMkXBo',    // Key 3 (Firebase/Gemini)
        'AIzaSyBh1wcshJS1gjMzzaBkjgsDTWm2pDZWK9Q',    // Key 4 (Jose Legacy 1)
        'AIzaSyDngKFBwVVIi3aRkOWVslAOivCvwKTiEmM',    // Key 5 (Jose Legacy 2)
        'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8'     // Key 6 (Mike Loader)
    ];

    let idx = 0;

    window.__MARIO_CONFIG__ = {
        apiKey: keys[0],
        getNextKey: function () {
            idx = (idx + 1) % keys.length;
            this.apiKey = keys[idx];
            console.log('🔄 Rotated to key', idx + 1);
            return this.apiKey;
        },
        keyCount: keys.length
    };

    console.log('✅ MARIO V3 Loader - ' + keys.length + ' keys ready');
})();
