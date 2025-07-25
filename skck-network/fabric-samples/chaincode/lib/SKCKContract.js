'use strict';

const { Contract } = require('fabric-contract-api');

class SKCKContract extends Contract {
  constructor() {
    super('org.example.skckcontract');
    }
  async InitLedger(ctx) {
    console.info('Ledger initialized');
  }

  async createSKCK(ctx, id, nama, nik, tujuan, ipfsHash) {
    const skck = {
      id,
      nama,
      nik,
      tujuan,
      ipfsHash,
      timestamp: new Date().toISOString(),
    };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(skck)));
    return JSON.stringify(skck);
  }

  async readSKCK(ctx, id) {
    const skckAsBytes = await ctx.stub.getState(id);
    if (!skckAsBytes || skckAsBytes.length === 0) {
      throw new Error(`SKCK dengan ID ${id} tidak ditemukan`);
    }
    return skckAsBytes.toString();
  }
}

module.exports = SKCKContract;
