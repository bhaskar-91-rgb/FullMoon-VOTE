// This file is part of midnightntwrk/example-bboard.
// Copyright (C) Midnight Foundation
// SPDX-License-Identifier: Apache-2.0

import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/bboard/contract/index.js";
export * from "./witnesses.js";

import * as CompiledBBoardContract from "./managed/bboard/contract/index.js";
import * as Witnesses from "./witnesses.js";

class ContractWrapper extends CompiledBBoardContract.Contract<any, any> {
  constructor() {
    super(Witnesses.witnesses);
  }
}

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
const assetPath = isNode && process.env.BBOARD_MANAGED_DIR ? process.env.BBOARD_MANAGED_DIR : "./managed/bboard";

export const CompiledBBoardContractContract = CompiledContract.make(
  "bboard",
  ContractWrapper as any
).pipe(
  CompiledContract.withCompiledFileAssets(assetPath)
) as any;
