const crypto = require('crypto')

const primeP = crypto.generatePrime(128, {bigint: true}, (err, prime) => {
    console.log(prime); 
});

const primeQ = crypto.generatePrime(128, {bigint: true}, (err, prime) => console.log("128 bit prime Q generated."));
