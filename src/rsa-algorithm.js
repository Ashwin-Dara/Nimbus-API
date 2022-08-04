const crypto = require("crypto");
const bigintCryptoUtils = require("bigint-crypto-utils");
const fs = require("fs");
const path = require("path");
const Parallel = require('paralleljs')

/** Extended GCD algorithm for determining whether or not the current public key
 * meets the appropriate requirements. In particular, we test for if there exists a modular
 * inverse for e (mod phi(N)). */
function extendedGCD(a, b) {
  if (b == BigInt(0)) {
    return [BigInt(1), BigInt(0), a];
  }

  temp = extendedGCD(b, a % b);
  x = BigInt(temp[0]);
  y = BigInt(temp[1]);
  d = BigInt(temp[2]);
  return [y, x - (y * (a - (a % b))) / b, d];
}

/** Generates relevant keys for RSA encryption algorithm. Returns object containing
 * the public key (N, e) and the private key. */
function generateRSAKeys() {
  let privateKey = undefined;
  let publicN, publicE;
  while (privateKey == undefined) {
    /* Generating primes used for the public key (N, e). */
    let primeP = crypto.generatePrimeSync(5, { bigint: true });
    let primeQ = crypto.generatePrimeSync(5, { bigint: true });
    let phiN = (primeP - BigInt(1)) * (primeQ - BigInt(1));
    publicN = BigInt(primeP * primeQ);
    publicE = BigInt(3);

    /* Generating primes used for the public key (N, e).
     * Catching the exception in the case that the publicE does not produce a valid private key.
     * In that situation, we will check using the egcd test results and then re-generate
     * a set of prime numbers. */
    const egcd_val = extendedGCD(publicE, phiN);
    if (egcd_val[2] == 1) {
      privateKey = bigintCryptoUtils.modInv(publicE, BigInt(phiN));
    }
  }
  return {
    "public-key-N": `${publicN}`,
    "public-key-E": `${publicE}`,
    "private-key": `${privateKey}`,
  };
}

/** Writes RSA public and private keys to the local file path. Directory structure
 * is better explained by documentation in "design." */
function writeRSAKeys() {
  let rsaData = JSON.stringify(generateRSAKeys(), null, 2);
  console.log("RSA Data: ", rsaData);
  // Async file write.
  fs.writeFile(
    path.join("./", "core", "rsa", "rsa-info.json"),
    rsaData,
    (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log("Wrote RSA Keys")
    }
  );
}

/** 
 * @param filePath : file path of the file that you want to encrypt 
 * @param encryptionPath : path of the JSON file that contains relevant encryption information (pub/priv keys)
 * This function will encrypt the specified file with the inputted encryption scheme. */
function encryptFile(filePath, encryptionPath, outputPath = "./") {
  binary = fs.readFileSync(filePath);

  /* Retrieving relevant keys for the RSA encryption. */
  const rsaData = fs.readFileSync(encryptionPath);
  const rsaDataJSON = JSON.parse(rsaData);
  const rsaN = BigInt(rsaDataJSON["public-key-N"]);
  const rsaE = BigInt(rsaDataJSON["public-key-E"]);
  
  /* Clearing the original file (deleting previous data). */
  fs.writeFileSync(outputPath, "");

  /* Writing to the specified file */
  for (let pair of binary.entries()) {
    let x = BigInt(pair[1]) ** rsaE; 
    x = x % rsaN; 
    fs.appendFileSync(outputPath, x.toString() + " ", () => {console.log("Original Binary:", pair[1], "Encrypted:", x)});  
  }
  console.log("Successfully wrote binary to the specified path:", outputPath);
}


/** Decrypts the specified file and writes the decrypted contents into the provided
 * outputPath. Read more: https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/
 */
function decryptFile(filePath, encryptionPath, outputPath = "./") {
  binary = fs.readFileSync(filePath);

  const rsaJSON = JSON.parse(fs.readFileSync(encryptionPath));
  const rsaPrivateKey = BigInt(rsaJSON["private-key"]);
  const rsaN = BigInt(rsaJSON["public-key-N"]);

  console.log("Private Key:", rsaPrivateKey);
  fs.writeFileSync(outputPath, "");

  for (let i of binary.entries()) {
    let d = BigInt(i[1])
    for (let i = 0; i < (rsaPrivateKey - BigInt(1)); i += 1) {
      d = d*d
      d = d % rsaN;
    }
    d = d % rsaN

    fs.appendFile(outputPath, d.toString(), () => {console.log("decrypting")});
  }
}

exports.generateRSAKeys = generateRSAKeys; 
exports.extendedGCD = extendedGCD; 
exports.writeRSAKeys = writeRSAKeys; 
exports.encryptFile = encryptFile; 
exports.decryptFile = decryptFile;