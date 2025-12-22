/**
 * ORION TECH - SHARED PRICING SCRIPT
 * Version: 2.1 - Multi-currency conversion + Nekon & Price Book
 * Purpose: Sync pricing across all industry pages based on selected country
 */

// Exchange rates
const exchangeRates = {
    usa: 1,
    colombia: 4000,    // 1 USD = 4000 COP (Standardized)
    mexico: 18,        // 1 USD = 18 MXN
    peru: 3.7,         // 1 USD = 3.7 PEN
    ecuador: 1,        // USD
    canada: 1.35       // 1 USD = 1.35 CAD
};

// Regional pricing data
const regionalPricing = {
    usa: {
        currency: 'USD',
        symbol: '$',
        prices: {
            individuals: '297-497',
            restaurants: '1,497',
            liquor: '1,297',
            salons: '997',
            contractors: '1,497',
            retail: '1,197',
            enterprise: '4,997+',
            hosting: '69',
            nekon_strategic: '1,200',
            nekon_agent: '8,500',
            nekon_enterprise: '25,000+',
            labor_rate: '185'
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
            enterprise: '14,990,000+',
            hosting: '280,000',
            nekon_strategic: '4,800,000',
            nekon_agent: '34,000,000',
            nekon_enterprise: '100,000,000+',
            labor_rate: '185'
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
            enterprise: '89,997+',
            hosting: '1,250',
            nekon_strategic: '21,600',
            nekon_agent: '153,000',
            nekon_enterprise: '450,000+',
            labor_rate: '185'
        }
    }
};

/**
 * Load country from localStorage and update page pricing
 */
function loadCountryPricing() {
    const savedCountry = localStorage.getItem('orion_country') || 'usa';
    const pricing = regionalPricing[savedCountry] || regionalPricing['usa'];

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

    console.log('✅ Pricing Engine Sync:', savedCountry, pricing.currency);
}

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCountryPricing);
} else {
    loadCountryPricing();
}
