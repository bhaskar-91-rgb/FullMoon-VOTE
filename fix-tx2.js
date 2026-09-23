const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');

code = code.replace(
  /\{\s*CompiledBBoardContractContract\s*\},[\s\n\r]*\{\s*setNetworkId\s*\},[\s\n\r]*\]\s*=\s*await\s*Promise\.all\(\[/,
  '{ CompiledBBoardContractContract }, { setNetworkId }, { Transaction }, { toHex, fromHex } ] = await Promise.all(['
);

code = code.replace(
  /import\('@midnight-ntwrk\/midnight-js-network-id'\),[\s\n\r]*\]\);/,
  "import('@midnight-ntwrk/midnight-js-network-id'), import('@midnight-ntwrk/midnight-js-protocol/ledger'), import('@midnight-ntwrk/midnight-js-utils') ]);"
);

code = code.replace(
  /const\s*\{\s*toHex,\s*fromHex\s*\}\s*=\s*await\s*import\('@midnight-ntwrk\/midnight-js-utils'\);[\s\n\r]*const\s*\{\s*Transaction\s*\}\s*=\s*await\s*import\('@midnight-ntwrk\/midnight-js-protocol\/ledger'\);/g,
  ''
);

code = code.replace(
  /const\s*\{\s*toHex\s*\}\s*=\s*await\s*import\('@midnight-ntwrk\/midnight-js-utils'\);/g,
  ''
);

fs.writeFileSync('frontend/src/lib/onchain.ts', code);
