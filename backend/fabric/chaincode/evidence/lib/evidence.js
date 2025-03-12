'use strict';

const { Contract } = require('fabric-contract-api');

class EvidenceContract extends Contract {
    async initLedger(ctx) {
        console.log('Initialize the ledger');
    }

    async createEvidence(ctx, id, hash, metadata) {
        const evidence = {
            ID: id,
            Hash: hash,
            Metadata: metadata,
            Timestamp: new Date().toISOString(),
            Owner: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(evidence)));
        return JSON.stringify(evidence);
    }

    async queryEvidence(ctx, id) {
        const evidenceJSON = await ctx.stub.getState(id);
        if (!evidenceJSON || evidenceJSON.length === 0) {
            throw new Error(`Evidence ${id} does not exist`);
        }
        return evidenceJSON.toString();
    }

    async queryAllEvidence(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        return JSON.stringify(allResults);
    }

    async StoreEvidence(ctx, fileHash, metadata) {
        const evidence = {
            fileHash,
            metadata: JSON.parse(metadata),
            timestamp: new Date().toISOString(),
            owner: ctx.clientIdentity.getID()
        };

        await ctx.stub.putState(fileHash, Buffer.from(JSON.stringify(evidence)));
        return JSON.stringify(evidence);
    }
}

module.exports = EvidenceContract; 