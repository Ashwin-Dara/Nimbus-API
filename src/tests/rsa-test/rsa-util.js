const rsa = require("../../../drafts/Encrytion-Utils")
const path = require("path");

const rsaPath = path.join('..', '..', 'core', 'rsa')

rsa.generateRsaKeys(rsaPath)

// rsa.encryptFileContents(path.join("../", "test-data-1.txt"), "", path.join("../", "out", "test-util-enc-1.txt")); 
// rsa.decryptFileContents(path.join("../", "out", "test-util-enc-1.txt"), "", path.join("../", "out", "test-util-dec-1.txt")); 
