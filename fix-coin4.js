const fs = require('fs');
let code = fs.readFileSync('frontend/src/lib/onchain.ts', 'utf8');
code = code.replace(
  /} catch (e) { console.error('getShieldedAddresses failed', e); }/g,
  `} catch (e) { 
        console.error('getShieldedAddresses failed', e);
        if (e && e.message && e.message.includes('syncing')) {
          throw new Error('Your 1AM Wallet is currently syncing. Please open the 1AM wallet extension, wait for it to finish syncing, and then try again.');
        }
      }`
);
fs.writeFileSync('frontend/src/lib/onchain.ts', code);
