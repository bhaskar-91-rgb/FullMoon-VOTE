const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');
code = code.replace("if (!coinPublicKey && typeof ap.getState === 'function') {", `
        if (!coinPublicKey && typeof ap.getAddresses === 'function') {
          const addresses = await ap.getAddresses();
          if (addresses && addresses.length > 0) {
            const a = addresses[0];
            coinPublicKey = a.shieldedCoinPublicKey || a.coinPublicKey || (typeof a === 'string' ? a : null);
          }
        }
        if (!coinPublicKey && ap.address) coinPublicKey = ap.address;
        if (!coinPublicKey && ap.state?.address) coinPublicKey = ap.state.address;
        if (!coinPublicKey && typeof ap.getState === 'function') {`);
fs.writeFileSync('frontend/src/lib/onchain.ts', code);
