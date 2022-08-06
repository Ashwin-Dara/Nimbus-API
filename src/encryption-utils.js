const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

/** Generates a valid set of public and private keys for RSA.
 * Will write the keys within the specified  path given by the parameter "Path". */
function generateRsaKeys(outPath) {
  /* Generating all of the necessary keys. */
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  const exportedPublic = publicKey.export({ type: "pkcs1", format: "pem" });
  const exportedPrivate = privateKey.export({ type: "pkcs1", format: "pem" });

  /* Storing the necessary settings associated with RSA encrypting and saving the 
    configurations within file named 'rsa-settings.json'. */
  let rsaInformation = {
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  };

  /* Writing public keys, private keys, and the RSA configurations to specified outPath. */
  fs.writeFileSync(
    path.join(outPath.toString(), "public.pem"),
    exportedPublic,
    { encoding: "utf-8" }
  );
  fs.writeFileSync(
    path.join(outPath.toString(), "private.pem"),
    exportedPrivate,
    { encoding: "utf-8" }
  );
  fs.writeFileSync(
    path.join(outPath.toString(), "rsa-settings.json"),
    JSON.stringify(rsaInformation, null, 2)
  );
}

/** Encrypts the file specified the param "filePath". */
function encryptFileContents(filePath, rsaPath) {
  /* Parsing the base file name and the extension of the file to create another file later with same name.
   * Note that the ending post-fix is important in helping labelling and creating files later on when we
   * distribute them into chunks for faster upload and encryption. */
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);
  /* The new file created will be <original_name> + "-enc-$0". */
  const outPath = path.join(
    rsaPath.toString(),
    "encryptions",
    name + "-enc-$0" + ext
  );

  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  const pubKey = Buffer.from(
    fs.readFileSync(path.join(rsaPath.toString(), "public.pem"), {
      encoding: "utf-8",
    })
  );

  /* Encrypting the data from the file that was read with the appropriate information
   * needed alongside just the data we want to encrypt (e.g., padding and hash). */
  let encData = crypto.publicEncrypt(
    {
      key: pubKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );

  /* Writing encrypted data to the new file path.*/
  fs.writeFileSync(outPath, encData.toString("base64"), { encoding: "utf-8" });
}

/** Decrypts the encrypted file given the original file name an the rsaPath.
 * Typically, decrypted files will be stored with the original contents within a folder located
 * under the code directory. 
 * However, user's themselves will have the option into which directory they can store the decrypted file.
 */
function decryptFileContents(filePath, rsaPath, outPath = false) {
  /* Parsing the original file name and the extension of the file. */
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);

  /* Setting up the default outPath. */
  const encryptedPath = path.join(
    rsaPath.toString(),
    "encryptions",
    name + "-enc-$0" + ext
  );

  const out = path.join(
    rsaPath.toString(),
    "decryptions",
    name + "-decrypted" + ext
  );

  /* Checking whether or not the user defined outPath is valid. */
  if (!outPath || !fs.existsSync(outPath)) {
    outPath = out;
  }

  /* Preparing for the function call to decrypt the encrypted data. */
  const encData = fs.readFileSync(encryptedPath, { encoding: "utf-8" });
  const privKey = fs.readFileSync(
    path.join(rsaPath.toString(), "private.pem"),
    { encoding: "utf-8" }
  );

  let decData = crypto.privateDecrypt(
    {
      key: privKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encData, "base64")
  );

  /* Writing the decrypted data within the specified outPath. */
  fs.writeFileSync(outPath, decData.toString("utf-8"), { encoding: "utf-8" });
}

exports.encryptFileContents = encryptFileContents;
exports.decryptFileContents = decryptFileContents;
exports.generateRsaKeys = generateRsaKeys;
