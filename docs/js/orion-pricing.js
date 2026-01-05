/**
 * ORION TECH - PRICING ENGINE v3.0
 * Structure: Setup Fee + Monthly + Discounts + Add-ons
 * Last Updated: January 2026
 */

// Exchange rates (updated periodically)
const exchangeRates = {
    usa: 1,
    colombia: 4000,    // 1 USD = 4000 COP
    mexico: 18,        // 1 USD = 18 MXN
    peru: 3.7,         // 1 USD = 3.7 PEN
    ecuador: 1,        // USD
    canada: 1.35       // 1 USD = 1.35 CAD
};

// Complete pricing structure by industry
const pricingStructure = {
    individuals: {
        name: 'Individuals / Freelancers',
        setup: 497,
        monthly: { base: 197, premium: 297, enterprise: null },
        includes: ['WhatsApp Bot', 'FAQ (50 Q)', 'Service Menu', '24/7 Responses', 'Email Support']
    },
    salons: {
        name: 'Beauty Salons / Spas',
        setup: 1497,
        monthly: { base: 497, premium: 697, enterprise: 997 },
        includes: ['WhatsApp + Web', 'Smart Booking', 'Auto Reminders', 'Service Catalog', 'Up to 5 Staff']
    },
    restaurants: {
        name: 'Restaurants / Cafés',
        setup: 1997,
        monthly: { base: 697, premium: 997, enterprise: 1497 },
        includes: ['WhatsApp + Web', 'Digital Menu + Photos', 'Reservations', 'Pickup Orders', 'Daily Promos']
    },
    liquor: {
        name: 'Liquor Stores / Wine Shops',
        setup: 1797,
        monthly: { base: 597, premium: 897, enterprise: 1297 },
        includes: ['WhatsApp + Web', 'Product Catalog (200 SKU)', 'Age Verification', 'Weekly Promos', 'Recommendations']
    },
    contractors: {
        name: 'Contractors / Trades',
        setup: 2497,
        monthly: { base: 797, premium: 1197, enterprise: 1497 },
        includes: ['WhatsApp + Web', 'Quote System (G/B/B)', 'Price Book', 'Appointment Scheduling', 'Lead Capture']
    },
    retail: {
        name: 'Retail Stores',
        setup: 1697,
        monthly: { base: 597, premium: 897, enterprise: 1197 },
        includes: ['WhatsApp + Web', 'Product Catalog (100)', 'Stock Check', 'Store Info', 'Active Promos']
    },
    enterprise: {
        name: 'Enterprise / Custom',
        setup: 4997, // Starting from
        monthly: { base: 2997, premium: 4997, enterprise: 9997 },
        includes: ['Everything Custom', 'Multi-location', 'ERP/CRM Integration', 'SLA 99.5%', 'Dedicated Support']
    }
};

// Loyalty discounts by contract length
const contractDiscounts = {
    1: { monthly: 0, setup: 0 },       // Month to month
    6: { monthly: 0.10, setup: 0 },    // 10% off monthly
    12: { monthly: 0.20, setup: 0.25 }, // 20% monthly, 25% setup
    24: { monthly: 0.30, setup: 0.50 }  // 30% monthly, 50% setup
};

// Regional pricing (calculated from USD base)
const regionalPricing = {
    usa: {
        currency: 'USD',
        symbol: '$',
        prices: {
            // For backward compatibility with existing pages
            individuals: '197-297',
            restaurants: '697-1,497',
            liquor: '597-1,297',
            salons: '497-997',
            contractors: '797-1,497',
            retail: '597-1,197',
            enterprise: '2,997+',
            hosting: 'Included',
            setup_individuals: '497',
            setup_salons: '1,497',
            setup_restaurants: '1,997',
            setup_contractors: '2,497',
            labor_rate: '185'
        }
    },
    colombia: {
        currency: 'COP',
        symbol: '$',
        multiplier: 4000,
        prices: {
            individuals: '790,000-1,190,000',
            restaurants: '2,790,000-5,990,000',
            liquor: '2,390,000-5,190,000',
            salons: '1,990,000-3,990,000',
            contractors: '3,190,000-5,990,000',
            retail: '2,390,000-4,790,000',
            enterprise: '11,990,000+',
            hosting: 'Incluido',
            setup_salons: '5,990,000'
        }
    },
    mexico: {
        currency: 'MXN',
        symbol: '$',
        multiplier: 18,
        prices: {
            individuals: '3,550-5,350',
            restaurants: '12,550-26,950',
            liquor: '10,750-23,350',
            salons: '8,950-17,950',
            contractors: '14,350-26,950',
            retail: '10,750-21,550',
            enterprise: '53,950+',
            hosting: 'Incluido'
        }
    }
};

/**
 * Calculate price with discounts
 */
function calculatePrice(industry, tier, contractMonths, country = 'usa') {
    const pkg = pricingStructure[industry];
    if (!pkg) return null;

    const baseMonthly = pkg.monthly[tier] || pkg.monthly.base;
    const baseSetup = pkg.setup;
    const discounts = contractDiscounts[contractMonths] || contractDiscounts[1];

    const rate = exchangeRates[country] || 1;

    return {
        setup: Math.round(baseSetup * (1 - discounts.setup) * rate),
        monthly: Math.round(baseMonthly * (1 - discounts.monthly) * rate),
        savings: {
            setup: Math.round(baseSetup * discounts.setup * rate),
            monthly: Math.round(baseMonthly * discounts.monthly * rate)
        }
    };
}

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

    console.log('✅ ORION Pricing Engine v3.0 Loaded:', savedCountry, pricing.currency);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.orionPricing = {
        structure: pricingStructure,
        discounts: contractDiscounts,
        regional: regionalPricing,
        calculate: calculatePrice
    };
}

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCountryPricing);
} else {
    loadCountryPricing();
}

