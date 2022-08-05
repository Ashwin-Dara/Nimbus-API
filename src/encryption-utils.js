const crypto = require('crypto')
const path = require('path')
const fs = require("fs");


/** Generates a valid set of public and private keys for RSA. 
 * Will write the keys within the specified  path given by the parameter "Path". */
function generateRsaKeys(outPath) {
    /* Generating all of the necessary keys. */
    const {publicKey, privateKey} = crypto.generateKeyPairSync("rsa", {modulusLength: 2048});
    const exportedPublic = publicKey.export({type: "pkcs1",  format: "pem"});
    const exportedPrivate = privateKey.export({type: "pkcs1",  format: "pem"});

    /* Storing the necessary settings associated with RSA encrypting and saving the 
    configurations within file named 'rsa-settings.json'. */
    let rsaInformation = {
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, 
        oaepHash: 'sha256'
    };

    /* Writing public keys, private keys, and the RSA configurations to specified outPath. */
    fs.writeFileSync(path.join(outPath.toString(), "public.pem"), exportedPublic, {encoding: 'utf-8'});
    fs.writeFileSync(path.join(outPath.toString(), "private.pem"), exportedPrivate, {encoding: 'utf-8'});
    fs.writeFileSync(path.join(outPath.toString(), "rsa-settings.json"), JSON.stringify(rsaInformation, null, 2)); 
} 

/** Encrypts the file specified the param "filePath". */
function encryptFileContents(filePath, rsaPath) { 

    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    const outPath = path.join(rsaPath.toString(), "encryptions", name + "-enc-$0" + ext);

    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const pubKey = Buffer.from( fs.readFileSync(path.join(rsaPath.toString(), "public.pem"), { encoding: 'utf-8'}));

    let encData = crypto.publicEncrypt({
        key: pubKey, 
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, 
        oaepHash: 'sha256'
    }, Buffer.from(data));

    fs.writeFileSync(outPath, encData.toString('base64'), { encoding: 'utf-8' });
}

function decryptFileContents(filePath, rsaPath, outPath = false) {
    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    const encryptedPath = path.join(rsaPath.toString(), "encryptions", name + "-enc-$0" + ext);

    const out = path.join(rsaPath.toString(), "decryptions", name + "-decrypted" + ext);

    if (!outPath || !fs.existsSync(outPath)) {
        outPath = out; 
    }


    const encData = fs.readFileSync(encryptedPath, { encoding:'utf-8' });
    const privKey = fs.readFileSync(path.join(rsaPath.toString(), "private.pem"), {encoding : 'utf-8'});

    let decData = crypto.privateDecrypt({
        key: privKey, 
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, 
        oaepHash: 'sha256'
    }, Buffer.from(encData, 'base64'));

    fs.writeFileSync(outPath, decData.toString('utf-8'), { encoding: 'utf-8'} );
}

exports.encryptFileContents = encryptFileContents;
exports.decryptFileContents = decryptFileContents;
exports.generateRsaKeys = generateRsaKeys; 