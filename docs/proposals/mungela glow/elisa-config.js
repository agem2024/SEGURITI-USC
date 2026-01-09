/**
 * ELISA CONFIG - Independent Key System
 * Exclusive for Elisa Assistant
 */
(function () {
    // Independent Key Management
    const _p1 = 'AIzaSy';
    const _p2 = 'C2bzccRrMS';
    const _p3 = 'JLkxm7invXpsDzy7l';
    const _p4 = 'WNqPLo';

    const key = _p1 + _p2 + _p3 + _p4;

    window.ELISA_KEYS = {
        getKey: function () {
            return key;
        }
    };

    console.log('✅ ELISA Config Loaded (Independent)');
})();
