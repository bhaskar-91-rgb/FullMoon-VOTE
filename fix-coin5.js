const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');

code = code.replace(/\\n/g, '\n');

fs.writeFileSync('frontend/src/lib/onchain.ts', code);
