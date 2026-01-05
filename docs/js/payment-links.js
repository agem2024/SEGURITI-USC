/**
 * ORION Tech Payment Links Configuration
 * Integrates Stripe Payment Links for USA/Mexico and Wompi for Colombia
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create Payment Links in Stripe Dashboard (https://dashboard.stripe.com/payment-links)
 * 2. Replace the placeholder URLs below with your actual Payment Links
 * 3. For Colombia: Create Wompi links at https://wompi.com
 */

const PAYMENT_CONFIG = {
    // ========================================
    // USA PAYMENT LINKS (Stripe)
    // ========================================
    usa: {
        currency: 'USD',
        provider: 'stripe',
        plans: {
            starter: {
                setup: 'https://buy.stripe.com/YOUR_STARTER_SETUP_LINK_USA',
                monthly: 'https://buy.stripe.com/YOUR_STARTER_MONTHLY_USA'
            },
            growth: {
                setup: 'https://buy.stripe.com/YOUR_GROWTH_SETUP_LINK_USA',
                monthly: 'https://buy.stripe.com/YOUR_GROWTH_MONTHLY_USA'
            },
            pro: {
                setup: 'https://buy.stripe.com/YOUR_PRO_SETUP_LINK_USA',
                monthly: 'https://buy.stripe.com/YOUR_PRO_MONTHLY_USA'
            }
        }
    },

    // ========================================
    // MEXICO PAYMENT LINKS (Stripe Mexico - supports OXXO)
    // ========================================
    mexico: {
        currency: 'MXN',
        provider: 'stripe',
        plans: {
            starter: {
                setup: 'https://buy.stripe.com/YOUR_STARTER_SETUP_LINK_MX',
                monthly: 'https://buy.stripe.com/YOUR_STARTER_MONTHLY_MX'
            },
            growth: {
                setup: 'https://buy.stripe.com/YOUR_GROWTH_SETUP_LINK_MX',
                monthly: 'https://buy.stripe.com/YOUR_GROWTH_MONTHLY_MX'
            },
            pro: {
                setup: 'https://buy.stripe.com/YOUR_PRO_SETUP_LINK_MX',
                monthly: 'https://buy.stripe.com/YOUR_PRO_MONTHLY_MX'
            }
        }
    },

    // ========================================
    // COLOMBIA PAYMENT LINKS (Wompi - supports Nequi, Daviplata, PSE)
    // ========================================
    colombia: {
        currency: 'COP',
        provider: 'wompi',
        plans: {
            starter: {
                setup: 'https://checkout.wompi.co/l/YOUR_STARTER_SETUP_CO',
                monthly: 'https://checkout.wompi.co/l/YOUR_STARTER_MONTHLY_CO'
            },
            growth: {
                setup: 'https://checkout.wompi.co/l/YOUR_GROWTH_SETUP_CO',
                monthly: 'https://checkout.wompi.co/l/YOUR_GROWTH_MONTHLY_CO'
            },
            pro: {
                setup: 'https://checkout.wompi.co/l/YOUR_PRO_SETUP_CO',
                monthly: 'https://checkout.wompi.co/l/YOUR_PRO_MONTHLY_CO'
            }
        }
    }
};

/**
 * Get payment link for a specific plan and country
 * @param {string} plan - 'starter', 'growth', or 'pro'
 * @param {string} type - 'setup' or 'monthly'
 * @param {string} country - Country code from localStorage
 * @returns {string} Payment link URL
 */
function getPaymentLink(plan, type, country) {
    // Map country selection to payment config
    const countryMap = {
        'usa': 'usa',
        'bay_area': 'usa',
        'mexico': 'mexico',
        'colombia': 'colombia',
        'peru': 'usa', // Fallback to USA Stripe for Peru
        'canada': 'usa', // Fallback to USA Stripe for Canada
        'ecuador': 'usa' // Fallback
    };

    const configCountry = countryMap[country] || 'usa';
    const config = PAYMENT_CONFIG[configCountry];

    if (config && config.plans[plan] && config.plans[plan][type]) {
        return config.plans[plan][type];
    }

    // Default fallback
    return 'https://wa.me/16692342444?text=I%20want%20to%20pay%20for%20' + plan;
}

/**
 * Open payment page for a plan
 * @param {string} plan - Plan name
 * @param {string} type - 'setup' or 'monthly'
 */
function openPayment(plan, type = 'setup') {
    const country = localStorage.getItem('orion_country') || 'usa';
    const paymentUrl = getPaymentLink(plan.toLowerCase(), type, country);

    // Track payment intent
    if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
            'event_category': 'Payments',
            'event_label': `${plan}_${type}`,
            'value': plan === 'starter' ? 997 : plan === 'growth' ? 1997 : 3997
        });
    }

    // Open payment page
    window.open(paymentUrl, '_blank');
}

/**
 * Check if payment links are configured (not placeholders)
 */
function isPaymentConfigured(country) {
    const config = PAYMENT_CONFIG[country];
    if (!config) return false;

    // Check if any link is still a placeholder
    const starterLink = config.plans.starter.setup;
    return !starterLink.includes('YOUR_');
}

// Export for use in HTML
window.openPayment = openPayment;
window.getPaymentLink = getPaymentLink;
window.isPaymentConfigured = isPaymentConfigured;

console.log('💳 ORION Payment Links v1.0 loaded');
