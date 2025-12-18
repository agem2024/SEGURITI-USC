/**
 * DYNAMIC PRICING ENGINE v1.0
 * Centralized logic for Sector, Urgency, Risk, and Material pricing adjustments.
 */

// 1. CONSTANTS & MULTIPLIERS
const MULTIPLIERS = {
    sector: {
        res: { val: 1.0, label: 'RESIDENCIAL' },
        com: { val: 1.3, label: 'COMMERCIAL' },
        ind: { val: 1.6, label: 'INDUSTRIAL' }
    },
    urgency: {
        std: { val: 1.0, label: 'SCHEDULED' },
        pri: { val: 1.5, label: 'PRIORITY' },
        emg: { val: 2.0, label: 'EMERGENCY' }
    },
    risk: {
        l1: { val: 1.0, label: 'LOW RISK' },
        l2: { val: 1.25, label: 'ELEVATED' },
        l3: { val: 1.5, label: 'HAZARDOUS' }
    },
    material: { // Used for Universal Services
        std: { val: 1.0, label: 'STANDARD' },
        cop: { val: 1.2, label: 'PREMIUM' },
        spec: { val: 1.4, label: 'SPECIALTY' }
    }
};

// 2. STATE MANAGEMENT
// keys: serviceId -> { sector, urgency, risk, material(optional) }
const CONFIGS = {};

// 3. SERVICE CATALOG (Base Prices)
// This can be populated dynamically or statically.
const SERVICE_CATALOG = {};

/**
 * Initialize a service in the catalog.
 * @param {string} id - The DOM ID of the service (e.g., 'srv-10')
 * @param {number} basePrice - The starting price
 * @param {string} name - Service name
 */
function registerService(id, basePrice, name) {
    SERVICE_CATALOG[id] = { basePrice, name };
    // Set default config
    CONFIGS[id] = {
        sector: 'res',
        urgency: 'std',
        risk: 'l1',
        material: 'std'
    };
}

/**
 * Select a configuration option for a specific service.
 * @param {string} serviceId - The ID of the service card
 * @param {string} type - 'sector', 'urgency', 'risk', or 'material'
 * @param {string} value - The key for the multiplier (e.g., 'com', 'emg')
 * @param {HTMLElement} btnElement - The button clicked
 */
function selectConfig(serviceId, type, value, btnElement) {
    // 1. Update State
    if (!CONFIGS[serviceId]) {
        console.error(`Service ${serviceId} not registered in CONFIGS`);
        return;
    }
    CONFIGS[serviceId][type] = value;

    // 2. Update UI (Button Validation)
    // Find the container for this specific group options within the specific service card
    const group = btnElement.parentElement;
    const buttons = group.querySelectorAll('.config-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');

    // 3. Recalculate
    calculatePrice(serviceId);
}

/**
 * Calculate and display the final price for a service.
 * @param {string} serviceId 
 */
function calculatePrice(serviceId) {
    const config = CONFIGS[serviceId];
    const service = SERVICE_CATALOG[serviceId];

    if (!config || !service) return;

    // Get Multipliers
    const mSector = MULTIPLIERS.sector[config.sector].val;
    const mUrgency = MULTIPLIERS.urgency[config.urgency].val;
    const mRisk = MULTIPLIERS.risk[config.risk].val;

    // Optional Material Multiplier (if used by this service UI)
    let mMaterial = 1.0;
    if (config.material && MULTIPLIERS.material[config.material]) {
        mMaterial = MULTIPLIERS.material[config.material].val;
    }

    // Formula: Base * Sector * Urgency * Risk * Material
    // Note: You might want to apply them additively or multiplicatively. 
    // Using multiplicative as established in previous logic.
    let finalPrice = service.basePrice * mSector * mUrgency * mRisk * mMaterial;

    // Rounding: To nearest $5 or integer
    finalPrice = Math.round(finalPrice);

    // Update Display
    const priceDisplay = document.getElementById(`dynamic-price-value-${serviceId}`);
    const breakdownDisplay = document.getElementById(`dynamic-breakdown-text-${serviceId}`);

    if (priceDisplay) {
        // Format with animation trigger if changed (simple text update for now)
        priceDisplay.innerText = '$' + finalPrice.toLocaleString();
    }

    if (breakdownDisplay) {
        // Logic to show detailed text explanation
        const texts = [];
        if (config.sector !== 'res') texts.push(MULTIPLIERS.sector[config.sector].label);
        if (config.urgency !== 'std') texts.push(MULTIPLIERS.urgency[config.urgency].label);
        if (config.risk !== 'l1') texts.push(MULTIPLIERS.risk[config.risk].label);
        if (config.material !== 'std') texts.push(MULTIPLIERS.material[config.material].label);

        breakdownDisplay.innerText = texts.length > 0 ? texts.join(' + ') + ' APPLIED' : 'Base Rate Included';

        // Color changes based on urgency
        if (config.urgency === 'emg') {
            priceDisplay.style.color = '#ff4444'; // Red for emergency
        } else {
            priceDisplay.style.color = 'var(--primary)'; // Default cyan
        }
    }
}

/**
 * Toggle the detail view for a specific service.
 */
function togglePackageDetail(serviceId, pkgLevel) { // pkgLevel kept for compatibility, defaulting to 'good' usually
    // Find the specific detail block by ID
    const detailBlock = document.getElementById(`detail-${serviceId}-${pkgLevel}`);
    if (!detailBlock) {
        console.error(`Detail block not found: detail-${serviceId}-${pkgLevel}`);
        return;
    }

    // Simple toggle logic
    if (detailBlock.style.display === 'block' || detailBlock.style.display === '') {
        detailBlock.style.display = 'none';
    } else {
        detailBlock.style.display = 'block';
        // Scroll to it
        detailBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Switch tabs in the detail view.
 */
function switchTab(serviceId, pkgLevel, mode) {
    const detailBlock = document.querySelector(`#detail-${serviceId}-${pkgLevel}`) || document.getElementById(serviceId);
    if (!detailBlock) return;

    // Use scoped selector within the specific service detail block
    // Note: The structure expects .pkg-specific-data or the service card container

    // We need to find the specific tab buttons and content *within this context*
    // This part is tricky if identifiers are not unique, but we used IDs in the HTML generation.
    // Let's rely on the passed IDs or search within the detail block.

    // Assuming the buttons call this function and we can just toggle classes on elements found by ID logic?
    // Actually, in the HTML we have: onclick="switchTab('srv-13', 'good', 'client')"

    // In universal template, the id is `detail-srv-13-good`.
    const container = document.getElementById(`detail-${serviceId}-${pkgLevel}`);
    if (!container) return;

    const clientTab = container.querySelector('.tab-client');
    const techTab = container.querySelector('.tab-tech');
    const clientContent = container.querySelector('.content-client');
    const techContent = container.querySelector('.content-tech');

    if (mode === 'client') {
        if (clientTab) clientTab.classList.add('active');
        if (techTab) techTab.classList.remove('active-tech');
        if (clientContent) clientContent.style.display = 'block';
        if (techContent) techContent.style.display = 'none';
    } else {
        if (clientTab) clientTab.classList.remove('active');
        if (techTab) techTab.classList.add('active-tech');
        if (clientContent) clientContent.style.display = 'none';
        if (techContent) techContent.style.display = 'block';
    }
}
