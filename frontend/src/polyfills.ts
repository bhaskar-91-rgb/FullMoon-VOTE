import { Buffer } from "buffer";

interface PolyfilledWindow {
  Buffer?: typeof Buffer;
  process?: { env: Record<string, string | undefined> };
}

if (typeof window !== "undefined") {
  const win = window as unknown as PolyfilledWindow;
  const g = globalThis as unknown as PolyfilledWindow;

  if (!win.Buffer) {
    win.Buffer = Buffer;
  }
  if (!g.Buffer) {
    g.Buffer = Buffer;
  }
  if (!win.process) {
    win.process = { env: {} };
  }
}

// -----------------------------------------------------------------------
// Midnight Compact Runtime polyfill — currentQueryContext
//
// The compiled Compact contract JS (bboard/contract/index.js) calls
// `currentQueryContext()` from its runtime closure. In a browser context
// this global is never set by the SDK, causing:
//   TypeError: Cannot read properties of undefined (reading 'currentQueryContext')
//
// We inject a safe no-op stub here so the SDK can initialize properly.
// The real context is then patched in by the SDK when it executes a ZK
// transaction — this stub only prevents the crash during module load/init.
// -----------------------------------------------------------------------
(function patchMidnightRuntime() {
  const g = globalThis as Record<string, unknown>;

  // The compact runtime expects a module-level `currentQueryContext` function
  // to be available on the global scope (or injected into its closure).
  // We provide a stub that returns an empty object so the SDK can proceed.
  if (!g['currentQueryContext']) {
    g['currentQueryContext'] = function () {
      return {
        // Minimal stub — the real ZK proof generation will override this
        queryContext: null,
        witnessContext: null,
        ledgerContext: null,
      };
    };
  }

  // Some compact versions also look for these:
  if (!g['copyCircuitContext']) {
    g['copyCircuitContext'] = function (ctx: unknown) { return ctx; };
  }
  if (!g['finalizeCallProofData']) {
    g['finalizeCallProofData'] = function () { return null; };
  }
})();

export { Buffer };

// End of polyfills
