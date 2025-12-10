// Patch Orion index.js to include I-601A commands
const fs = require('fs');

const ORION_INDEX = 'C:/Users/alexp/OneDrive/Documentos/_Proyectos/acwater/02_Projects/AI_Development/AI_Media/PROYECTOS/AI_Impact_Bay_Area/orion-clean/index.js';

try {
    let content = fs.readFileSync(ORION_INDEX, 'utf8');

    // Check if already patched
    if (content.includes('i601a-commands')) {
        console.log('[OK] Already patched with i601a-commands');
        process.exit(0);
    }

    // Add require statement after qrcode require
    const requireLine = "\nconst { handleI601ACommand } = require('./src/i601a-commands');";

    if (content.includes("require('qrcode-terminal')")) {
        content = content.replace(
            "require('qrcode-terminal');",
            "require('qrcode-terminal');" + requireLine
        );
        console.log('[OK] Added require for i601a-commands');
    }

    // Find message handler location and add I-601A check before AI processing
    // Look for the generateResponse call and add before it
    const i601aHandler = `
        // I-601A COMMANDS HANDLER
        const i601aResponse = handleI601ACommand(body);
        if (i601aResponse) {
            await sock.sendMessage(from, { text: i601aResponse });
            console.log('[I-601A] Command handled:', body);
            return;
        }
`;

    if (content.includes('generateResponse(') && !content.includes('handleI601ACommand(body)')) {
        // Add before the first generateResponse call
        content = content.replace(
            /const response = await generateResponse/,
            i601aHandler + '\n            const response = await generateResponse'
        );
        console.log('[OK] Added I-601A handler before generateResponse');
    }

    // Write patched file
    fs.writeFileSync(ORION_INDEX, content, 'utf8');
    console.log('[SUCCESS] Orion index.js patched successfully!');
    console.log('\nI-601A Commands Available:');
    console.log('  - law 1');
    console.log('  - fotos');
    console.log('  - editar foto');
    console.log('  - estado');
    console.log('  - dame [documento]');
    console.log('  - gastos');

} catch (error) {
    console.error('[ERROR]', error.message);
    process.exit(1);
}
