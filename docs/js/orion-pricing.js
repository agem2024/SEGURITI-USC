/**
 * ORION TECH - SHARED PRICING SCRIPT
 * Version: 2.0 - Multi-currency conversion
 * Purpose: Sync pricing across all industry pages based on selected country
 */

// Exchange rates (approximate, for display purposes)
const exchangeRates = {
    usa: 1,
    colombia: 4100,    // 1 USD = 4100 COP
    mexico: 18,        // 1 USD = 18 MXN
    peru: 3.7,         // 1 USD = 3.7 PEN
    ecuador: 1,        // Ecuador uses USD
    canada: 1.35       // 1 USD = 1.35 CAD
};

// Currency symbols
const currencySymbols = {
    usa: '$',
    colombia: '$',
    mexico: '$',
    peru: 'S/',
    ecuador: '$',
    canada: '$'
};

// Currency codes
const currencyCodes = {
    usa: 'USD',
    colombia: 'COP',
    mexico: 'MXN',
    peru: 'PEN',
    ecuador: 'USD',
    canada: 'CAD'
};

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
            enterprise: '4,997+',
            hosting: '69',
            hosting_premium: '97'
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
            hosting_premium: '400,000'
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
            hosting_premium: '1,750'
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
            enterprise: '47,997+',
            hosting: '255',
            hosting_premium: '360'
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
            enterprise: '4,997+',
            hosting: '69',
            hosting_premium: '97'
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
            enterprise: '6,697+',
            hosting: '95',
            hosting_premium: '130'
        }
    }
};

/**
 * Convert USD price to local currency
 */
function convertPrice(usdPrice, country) {
    const rate = exchangeRates[country] || 1;
    const symbol = currencySymbols[country] || '$';
    const converted = Math.round(usdPrice * rate);

    // Format with thousands separator
    const formatted = converted.toLocaleString('en-US');
    return `${symbol}${formatted}`;
}

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

    // Auto-convert hardcoded USD prices in text
    if (savedCountry !== 'usa' && savedCountry !== 'ecuador') {
        convertHardcodedPrices(savedCountry, pricing);
    }

    console.log('✅ Pricing loaded for country:', savedCountry, pricing.currency);
}

/**
 * Find and convert hardcoded USD prices in the page
 */
function convertHardcodedPrices(country, pricing) {
    const rate = exchangeRates[country];
    const symbol = pricing.symbol;
    const currency = pricing.currency;

    // Convert text nodes containing $XX or $X,XXX patterns
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const nodesToUpdate = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        // Match patterns like $69, $97, $1,497, $2,997/mo, +$89/mo
        if (/\$[\d,]+/.test(node.textContent) && !node.parentElement.hasAttribute('data-price')) {
            nodesToUpdate.push(node);
        }
    }

    nodesToUpdate.forEach(node => {
        node.textContent = node.textContent.replace(/\$(\d{1,3}(?:,\d{3})*)/g, (match, numStr) => {
            const num = parseInt(numStr.replace(/,/g, ''), 10);
            const converted = Math.round(num * rate);
            return `${symbol}${converted.toLocaleString('en-US')}`;
        });
    });

    console.log(`💱 Converted ${nodesToUpdate.length} hardcoded prices to ${currency}`);
}

// Auto-load on page ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCountryPricing);
} else {
    loadCountryPricing();
}

