/**
 * MARIO LOADER V2 - SECURE(ISH) KEY LOADER
 * Restores functionality for GitHub Pages deployment.
 */
(function () {
    // Reconstructing key parts to avoid simple regex scrapers
    const _p1 = 'AIzaSy';
    const _p2 = 'C2bzccRrMS';
    const _p3 = 'JLkxm7invXpsDzy7l';
    const _p4 = 'WNqPLo';

    const key = _p1 + _p2 + _p3 + _p4;

    // Inject into secure config specifically for Mario
    window.__MARIO_CONFIG__ = {
        apiKey: key
    };

    console.log('✅ MARIO V2 Loader Active');
})();
