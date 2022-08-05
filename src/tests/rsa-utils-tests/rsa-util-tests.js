const rsaUtils = require("../../encryption-utils");
const path = require("path")
const rsaPath = path.join("..", "..", "core", "rsa");

const NUM_TESTS = 3; 
const EXT = ".txt"
rsaUtils.generateRsaKeys(rsaPath);

for (let i=0; i < NUM_TESTS; ++i) {
    console.log("Running Input Number " + (i+1));

    const inPath = path.join("..", "..", "..", "tests-in", "rsa-utils-test-in", "rsa-utils-test"  + String(i+1) + EXT);
    rsaUtils.encryptFileContents(inPath, rsaPath);
    rsaUtils.decryptFileContents(inPath, rsaPath); 
}


