const fs = require('fs');
const path = require('path');

const mangledPatterns = [
    "Ă´", "á»™", "á»", "áº", "Æ°", "Ä‘", "Ă³", "á»›", "Há»™i", "Nhiá»‡m"
];

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const pattern of mangledPatterns) {
                if (content.includes(pattern)) {
                    console.log(`FOUND MANGLED [${pattern}] in: ${fullPath}`);
                    break;
                }
            }
        }
    }
}

scanDir('c:/Users/levan/Downloads/ChipCraft');
console.log("Scan complete.");
