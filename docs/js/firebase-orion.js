/**
 * ORION Tech - Firebase Integration
 * Shared across all pages for consistent tracking
 * 
 * Usage: Add this script to any page:
 * <script type="module" src="js/firebase-orion.js"></script>
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration - ORION Tech
const firebaseConfig = {
    apiKey: "AIzaSyBJducUOcsPnNEtYOFI3sF60AfHUXMkXBo",
    authDomain: "orion-tech-6d893.firebaseapp.com",
    projectId: "orion-tech-6d893",
    storageBucket: "orion-tech-6d893.firebasestorage.app",
    messagingSenderId: "360237212144",
    appId: "1:360237212144:web:956c881d0231f2a3ecfd35",
    measurementId: "G-W87J0KK9SK"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);

// Log page visit to Firebase Analytics
logEvent(analytics, 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
});

// Track visit in Firestore
async function trackVisit() {
    try {
        await addDoc(collection(db, "visits"), {
            timestamp: serverTimestamp(),
            page: window.location.pathname,
            pageTitle: document.title,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            country: localStorage.getItem('orion_country') || 'usa',
            screenWidth: window.screen.width,
            screenHeight: window.screen.height
        });
        console.log('📊 ORION: Visit tracked');
    } catch (e) {
        console.log('Visit tracking error:', e.message);
    }
}
trackVisit();

// Save lead to Firestore - Available globally
window.saveLead = async function (leadData) {
    try {
        const docRef = await addDoc(collection(db, "leads"), {
            ...leadData,
            timestamp: serverTimestamp(),
            source: window.location.pathname,
            pageTitle: document.title,
            country: localStorage.getItem('orion_country') || 'usa',
            language: localStorage.getItem('orion_lang') || 'en'
        });
        logEvent(analytics, 'lead_captured', {
            lead_id: docRef.id,
            industry: leadData.industry || 'unknown'
        });
        console.log('📩 ORION: Lead saved:', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('Lead save error:', e);
        return null;
    }
};

// Track custom events
window.trackOrionEvent = function (eventName, eventParams = {}) {
    logEvent(analytics, eventName, eventParams);
    console.log('📈 ORION Event:', eventName, eventParams);
};

// Export for potential module usage
export { analytics, db, trackVisit };

console.log('🔥 ORION Firebase initialized');
