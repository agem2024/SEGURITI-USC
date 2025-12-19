/**
 * ORION TECH - SHARED PRICING SCRIPT
 * Version: 1.0
 * Purpose: Sync pricing across all industry pages based on selected country
 */

// Regional pricing data (synced with orion-bots.html)
const regionalPricing = {
    usa: {
        currency: 'USD',
        symbol: '$',
        prices: {
            individuals: '299',
            restaurants: '1,497',
            liquor: '1,297',
            salons: '997',
            contractors: '1,497',
            retail: '1,197',
            enterprise: '4,997+'
        }
    },
    colombia: {
        currency: 'COP',
        symbol: '$',
        prices: {
            individuals: '890,000',
            restaurants: '4,490,000',
            liquor: '3,890,000',
            salons: '2,990,000',
            contractors: '4,490,000',
            retail: '2,990,000',
            enterprise: '14,990,000+'
        }
    },
    mexico: {
        currency: 'MXN',
        symbol: '$',
        prices: {
            individuals: '5,297',
            restaurants: '26,997',
            liquor: '23,497',
            salons: '17,997',
            contractors: '26,997',
            retail: '18,000',
            enterprise: '89,997+'
        }
    },
    peru: {
        currency: 'PEN',
        symbol: 'S/',
        prices: {
            individuals: '2,397',
            restaurants: '11,997',
            liquor: '10,397',
            salons: '7,997',
            contractors: '11,997',
            retail: '9,597',
            enterprise: '47,997+'
        }
    },
    ecuador: {
        currency: 'USD',
        symbol: '$',
        prices: {
            individuals: '299',
            restaurants: '1,497',
            liquor: '1,297',
            salons: '997',
            contractors: '1,497',
            retail: '1,197',
            enterprise: '4,997+'
        }
    },
    canada: {
        currency: 'CAD',
        symbol: '$',
        prices: {
            individuals: '399',
            restaurants: '1,997',
            liquor: '1,727',
            salons: '1,327',
            contractors: '1,997',
            retail: '1,597',
            enterprise: '6,697+'
        }
    }
};

/**
 * Load country from localStorage and update page pricing
 */
function loadCountryPricing() {
    const savedCountry = localStorage.getItem('orion_country') || 'usa';
    const pricing = regionalPricing[savedCountry];

    if (!pricing) {
        console.warn('No pricing found for country:', savedCountry);
        return;
    }

    // Update all elements with data-price attribute  
    document.querySelectorAll('[data-price]').forEach(el => {
        const priceKey = el.getAttribute('data-price');
        if (pricing.prices[priceKey]) {
            el.textContent = `${pricing.symbol}${pricing.prices[priceKey]}`;
        }
    });

    // Update currency display elements
    document.querySelectorAll('[data-currency]').forEach(el => {
        el.textContent = pricing.currency;
    });

    console.log('✅ Pricing loaded for country:', savedCountry, pricing.currency);
}

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCountryPricing);
} else {
    loadCountryPricing();
}
