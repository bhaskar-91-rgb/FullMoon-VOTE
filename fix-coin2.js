const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');
code = code.replace(
  /if \(\!coinPublicKey\) \{\s*throw new Error\('Wallet coin public key not found/,
  `if (!coinPublicKey) coinPublicKey = walletState.address;
    if (!coinPublicKey) {
      throw new Error('Wallet coin public key not found`
);
fs.writeFileSync('frontend/src/lib/onchain.ts', code);
