import primeSet from "./Prime-Set";

function getNBitRandom(n) {
    const MAX = Math.pow(2, n) - 1; 
    const MIN = Math.pow(2, n-1) + 1; 
    return Math.floor(Math.random * (MAX - MIN)) + MIN; 
}

function getPrimeTestResult(candidate) {
    while(true) {
        for (const primes of primeSet) {
            if (candidate % primes == 0) {
                return false;
            }
        }
    }
    return true;
}

function getMillerTestResult(candidate) {
    
}