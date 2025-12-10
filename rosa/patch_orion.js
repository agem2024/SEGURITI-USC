// ORION I-601A INTEGRATION PATCH
// This file patches Orion to include I-601A commands

const fs = require('fs');
const path = require('path');

const ORION_DIR = 'C:\\Users\\alexp\\OneDrive\\Documentos\\_Proyectos\\acwater\\02_Projects\\AI_Development\\AI_Media\\PROYECTOS\\AI_Impact_Bay_Area\\orion-clean';
const INDEX_PATH = path.join(ORION_DIR, 'index.js');

// Read current index.js
let indexContent = fs.readFileSync(INDEX_PATH, 'utf8');

// Check if already patched
if (indexContent.includes('i601a-commands')) {
    console.log('[OK] I-601A module already integrated');
    process.exit(0);
}

// Add require at top (after existing requires)
const requireLine = "const { handleI601ACommand } = require('./src/i601a-commands');\n";
indexContent = indexContent.replace(
    "const qrcode = require('qrcode-terminal');",
    "const qrcode = require('qrcode-terminal');\n" + requireLine
);

// Find message handler and add I-601A check
const handlerCode = 
        // I-601A COMMANDS HANDLER
        const i601aResponse = handleI601ACommand(body);
        if (i601aResponse) {
            await sock.sendMessage(from, { text: i601aResponse });
            logger.info('I-601A command handled: ' + body);
            return;
        }
;

// Insert before AI processing
if (indexContent.includes('generateResponse')) {
    indexContent = indexContent.replace(
        /const response = await generateResponse/,
        handlerCode + '\n        const response = await generateResponse'
    );
}

// Write patched file
fs.writeFileSync(INDEX_PATH, indexContent, 'utf8');
console.log('[OK] Orion patched with I-601A commands');
console.log('[INFO] Commands available: law 1, fotos, editar foto, estado, dame [doc], gastos');
