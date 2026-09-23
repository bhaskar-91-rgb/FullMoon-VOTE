const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');

// Move imports to the top Promise.all
code = code.replace(
  '      { setNetworkId },\n    ] = await Promise.all([',
  '      { setNetworkId },\n      { Transaction },\n      { toHex, fromHex },\n    ] = await Promise.all(['
);

code = code.replace(
  "      import('@midnight-ntwrk/midnight-js-network-id'),\n    ]);",
  "      import('@midnight-ntwrk/midnight-js-network-id'),\n      import('@midnight-ntwrk/midnight-js-protocol/ledger'),\n      import('@midnight-ntwrk/midnight-js-utils'),\n    ]);"
);

// Remove the inline imports in balanceTx and submitTx
code = code.replace(
  /const \{ toHex, fromHex \} = await import\('@midnight-ntwrk\/midnight-js-utils'\);\s*const \{ Transaction \} = await import\('@midnight-ntwrk\/midnight-js-protocol\/ledger'\);/g,
  ''
);

code = code.replace(
  /const \{ toHex \} = await import\('@midnight-ntwrk\/midnight-js-utils'\);/g,
  ''
);

fs.writeFileSync('frontend/src/lib/onchain.ts', code);
