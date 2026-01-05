/**
 * ORION TECH - PRICING ENGINE v4.0 (SIMPLIFIED & PROFITABLE)
 * Structure: Flat Pricing (Starter, Growth, Pro)
 * Margin Target: >70%
 * Last Updated: January 5 2026
 */

// Exchange rates (Updated Weekly)
const exchangeRates = {
    usa: 1,
    colombia: 4000,    // 1 USD = 4000 COP
    mexico: 18,        // 1 USD = 18 MXN
    peru: 3.7,         // 1 USD = 3.7 PEN
    ecuador: 1,        // USD
    canada: 1.35       // 1 USD = 1.35 CAD
};

// Standardized Packages (Applied to all industries)
const standardPackages = {
    starter: {
        setup: 997,
        monthly: 197,
        name: 'STARTER'
    },
    growth: {
        setup: 1997,
        monthly: 397,
        name: 'GROWTH'
    },
    pro: {
        setup: 3997,
        monthly: 697,
        name: 'PRO'
    }
};

// Industry Configuration mapping to Standard Packages
const pricingStructure = {
    individuals: standardPackages,
    salons: standardPackages,
    restaurants: standardPackages,
    liquor: standardPackages,
    contractors: standardPackages,
    retail: standardPackages,
    enterprise: {
        starter: standardPackages.pro, // Enterprise starts at Pro level
        growth: { setup: 9997, monthly: 1497, name: 'CORP' },
        pro: { setup: 24997, monthly: 4997, name: 'CUSTOM' }
    }
};

// Regional pricing strings (Pre-formatted for display)
const regionalPricing = {
    usa: {
        currency: 'USD',
        symbol: '$',
        prices: {
            // Standard Tiers - Setup
            setup_starter: '997',
            setup_growth: '1,997',
            setup_pro: '3,997',

            // Standard Tiers - Monthly
            monthly_starter: '197',
            monthly_growth: '397',
            monthly_pro: '697',

            // Special Industry Defaults (Usually Growth Tier)
            individuals: '197',     // Starts at Starter
            salons: '397',          // Starts at Growth
            restaurants: '397',
            liquor: '397',
            contractors: '397',
            retail: '397',
            enterprise: '697+',

            // Legacy keys override (mapped to Growth tier for single-price display)
            setup_salons: '1,997',
            setup_restaurants: '1,997',
            setup_liquor: '1,997',
            setup_contractors: '1,997',
            setup_retail: '1,997',
            setup_individuals: '997',

            hosting: 'Included',
            labor_rate: '185'
        }
    },
    colombia: {
        currency: 'COP',
        symbol: '$',
        multiplier: 4000,
        prices: {
            setup_starter: '3,990,000',
            setup_growth: '7,990,000',
            setup_pro: '15,990,000',

            monthly_starter: '790,000',
            monthly_growth: '1,590,000',
            monthly_pro: '2,790,000',

            individuals: '790,000',
            salons: '1,590,000',
            restaurants: '1,590,000',
            liquor: '1,590,000',
            contractors: '1,590,000',
            retail: '1,590,000',

            setup_salons: '7,990,000',
            setup_restaurants: '7,990,000',
            setup_liquor: '7,990,000',
            setup_contractors: '7,990,000',
            setup_retail: '7,990,000',

            hosting: 'Incluido'
        }
    },
    mexico: {
        currency: 'MXN',
        symbol: '$',
        multiplier: 18,
        prices: {
            setup_starter: '17,997',
            setup_growth: '35,997',
            setup_pro: '71,997',

            monthly_starter: '3,550',
            monthly_growth: '7,150',
            monthly_pro: '12,550',

            individuals: '3,550',
            salons: '7,150',
            restaurants: '7,150',
            liquor: '7,150',
            contractors: '7,150',
            retail: '7,150',

            setup_salons: '35,997',
            setup_restaurants: '35,997',
            setup_liquor: '35,997',
            setup_contractors: '35,997',
            setup_retail: '35,997',

            hosting: 'Incluido'
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
        // Handle generic keys if specific ones don't exist
        if (pricing.prices[priceKey]) {
            el.textContent = `${pricing.symbol}${pricing.prices[priceKey]}`;
        }
    });

    // Update currency display elements
    document.querySelectorAll('[data-currency]').forEach(el => {
        el.textContent = pricing.currency;
    });

    // Update plan names if elements exist
    if (savedCountry !== 'usa') {
        document.querySelectorAll('.plan-name-starter').forEach(el => el.textContent = 'INICIAL');
        document.querySelectorAll('.plan-name-growth').forEach(el => el.textContent = 'CRECIMIENTO');
        document.querySelectorAll('.plan-name-pro').forEach(el => el.textContent = 'PROFESIONAL');
    }

    console.log('✅ ORION Pricing Engine v4.0 (Profitable) Loaded:', savedCountry, pricing.currency);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.orionPricing = {
        structure: pricingStructure,
        regional: regionalPricing,
        load: loadCountryPricing
    };
}

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCountryPricing);
} else {
    loadCountryPricing();
}
