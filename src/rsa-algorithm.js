const crypto = require('crypto');
const fs = require('fs');
const bigintCryptoUtils = require('bigint-crypto-utils');
const path = require('path')

function extendedGCD(a, b) {
    if (b == BigInt(0)) {
        return [BigInt(1), BigInt(0), a]
    }

    temp = extendedGCD(b, a%b);
    x = BigInt(temp[0]);
    y = BigInt(temp[1]);
    d = BigInt(temp[2]);
    return [y, x-y*(a - a%b)/b, d];
}

function generateRSAKeys() {
    let privateKey = undefined; 
    let publicN, publicE; 
    while (privateKey == undefined) {
        /* Generating primes used for the public key (N, e). */
        let primeP = crypto.generatePrimeSync(128, {bigint: true}); 
        let primeQ = crypto.generatePrimeSync(128, {bigint: true}); 
        let phiN = (primeP - BigInt(1)) * (primeQ - BigInt(1));
        publicN = BigInt(primeP * primeQ); 
        publicE = BigInt(7); 

        /* Generating primes used for the public key (N, e).
        * Catching the exception in the case that the publicE does not produce a valid private key. 
        * In that situation, we will check using the egcd test results and then re-generate 
        * a set of prime numbers. */
        const egcd_val = extendedGCD(publicE, phiN);
        if (egcd_val[2] == 1) {
            privateKey = bigintCryptoUtils.modInv(publicE, BigInt(phiN))
        }
    }
    return {
        "public-key-N": `${publicN}`,
        "public-key-E": `${publicE}`,
        "private-key": `${privateKey}`
    };
}

function writeRSAKeys() {
    let rsaData = JSON.stringify(generateRSAKeys(), null, 2);
    console.log("RSA Data: ", rsaData);
    fs.appendFile(path.join('./', 'core', 'rsa', 'rsa-info.json'), rsaData, (err, data) => {
        if (err) {
            console.log(err);
        }

    });
}

writeRSAKeys();
