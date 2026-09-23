import { midnightWallet } from './src/lib/midnightWallet.js'; // wait, no
import { hash } from '@midnight-ntwrk/midnight-js-utils';
import { Buffer } from 'buffer';

const adminSkHex = '7011d61b369c766e409b62fb915e7f093229b15dd6466f8da7905f32997b79d2';
const skBytes = Buffer.from(adminSkHex, 'hex');

// Wait, how to hash in midnight?
// I don't know the exact hashing function in JS. Let's try to just deploy using the actual midnight-js.
