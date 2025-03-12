'use strict';

const { Contract } = require('fabric-contract-api');

class EvidenceContract extends Contract {
    // Initialize the chaincode
    async InitLedger(ctx) {
        console.log('Evidence tracking chaincode initialized');
    }

    // Store evidence with retention period
    async StoreEvidence(ctx, fileHash, retentionPeriod) {
        const evidence = {
            fileHash,
            timestamp: new Date().getTime(),
            retentionPeriod: parseInt(retentionPeriod),
            deleted: false,
            docType: 'evidence'
        };

        await ctx.stub.putState(fileHash, Buffer.from(JSON.stringify(evidence)));
        return JSON.stringify(evidence);
    }

    // Check if evidence is still active
    async IsEvidenceActive(ctx, fileHash) {
        const evidenceJSON = await ctx.stub.getState(fileHash);
        if (!evidenceJSON || evidenceJSON.length === 0) {
            throw new Error(`Evidence ${fileHash} does not exist`);
        }

        const evidence = JSON.parse(evidenceJSON.toString());
        const currentTime = new Date().getTime();
        
        return !evidence.deleted && 
               currentTime < (evidence.timestamp + (evidence.retentionPeriod * 1000));
    }

    // Delete expired evidence
    async DeleteExpiredEvidence(ctx, fileHash) {
        const evidenceJSON = await ctx.stub.getState(fileHash);
        if (!evidenceJSON || evidenceJSON.length === 0) {
            throw new Error(`Evidence ${fileHash} does not exist`);
        }

        const evidence = JSON.parse(evidenceJSON.toString());
        const currentTime = new Date().getTime();
        
        if (currentTime < (evidence.timestamp + (evidence.retentionPeriod * 1000))) {
            throw new Error('Retention period not yet expired');
        }

        evidence.deleted = true;
        await ctx.stub.putState(fileHash, Buffer.from(JSON.stringify(evidence)));
        return JSON.stringify(evidence);
    }
}

module.exports = EvidenceContract;
module.exports.EvidenceContract = EvidenceContract;
module.exports.contracts = [EvidenceContract]; 