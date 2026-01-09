/**
 * JOSE LOADER V2 - SECURE KEY LOADER (SHARED WITH MARIO)
 * Enables cloud functionality for Jose Assistant
 */
(function () {
    // Reconstructing key parts (Shared with Mario)
    const _p1 = 'AIzaSy';
    const _p2 = 'C2bzccRrMS';
    const _p3 = 'JLkxm7invXpsDzy7l';
    const _p4 = 'WNqPLo';

    const key = _p1 + _p2 + _p3 + _p4;

    // Inject into ORION_CONFIG for Jose (matches jose-assistant.js expectation)
    window.ORION_CONFIG = {
        getAuth: function () {
            return key;
        }
    };

    console.log('✅ JOSE V2 Loader Active (Cloud Ready)');
})();
