const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');
code = code.replace(
  'if (!coinPublicKey) coinPublicKey = walletState.address;',
  `if (!coinPublicKey && typeof ap.getShieldedAddresses === 'function') {
      try {
        const shield = await ap.getShieldedAddresses();
        if (shield) {
          if (Array.isArray(shield) && shield.length > 0) {
            coinPublicKey = shield[0].shieldedCoinPublicKey || shield[0].coinPublicKey || shield[0];
          } else {
            coinPublicKey = shield.shieldedCoinPublicKey || shield.coinPublicKey;
          }
        }
      } catch (e) { console.error('getShieldedAddresses failed', e); }
    }`
);
fs.writeFileSync('frontend/src/lib/onchain.ts', code);
