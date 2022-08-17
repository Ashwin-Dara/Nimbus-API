const path = require('path');
const bcrypt = require("bcrypt");
const CloudUtils = require('../cloud-utils')
const RSA = require('../encryption-utils');
const Compression = require('../compression-utils');
const rsaPath = path.join('..', 'core', 'rsa');
const compPath = path.join('..', 'core', 'compression');


export default (bucketName, path, options) => {
    const login = prompt("Enter the password for this bucket:");
    const bucket = await CloudUtils.BucketSchema.findOne({bucket: bucketName}); 
    if (bucket) {
        const valid = await bcrypt.compare(login, bucket.authHash);
        if (valid) {
            let ext = path.extname(path);
            let name = path.basename(path, ext); 
            const compressedPath = path.join(compPath.toString(), "encodings", name + "-encoded.bin");
            Compression.encodeFile(path, compPath);
            RSA.encryptFileContents(compressedPath, rsaPath);
            CloudUtils.pushFile(path.join(rsaPath, "encryptions", name + "-enc-$0.txt").toString(), path);
            return;
        }
        else {
            console.log("Password was incorrect.");
            return;
        }
    } else {
        console.log("Bucket with that name was not found.");
        return; 
    }
}