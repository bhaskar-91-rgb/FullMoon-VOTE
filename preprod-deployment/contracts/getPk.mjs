import { persistentHash } from '@midnight-ntwrk/compact-runtime';
import { _descriptor_0_export } from './src/managed/bboard/contract/index.js';

const skHex = '7011d61b369c766e409b62fb915e7f093229b15dd6466f8da7905f32997b79d2';
const sk = new Uint8Array(Buffer.from(skHex, 'hex'));

const pk = persistentHash(_descriptor_0_export, sk);
console.log("PK_HEX=" + Buffer.from(pk).toString('hex'));
