const path = require('path');
const bcrypt = require("bcrypt");
const CloudUtils = require('../cloud-utils')
const RSA = require('../encryption-utils');
const Compression = require('../compression-utils');
const rsaPath = path.join('..', 'core', 'rsa');
const compPath = path.join('..', 'core', 'compression');

export default (bucketName, fileName, outPath, options) => {
    const login = prompt("Enter the password for this bucket:");
    const bucket = await CloudUtils.BucketSchema.findOne({bucket: bucketName});
    if (bucket) {
        const valid = await bcrypt.compare(login, bucket.authHash);
        if (valid) {
            const file = await CloudUtils.FileSchema.findOne({name : fileName});
            if (file) {
                CloudUtils.retrieveFile(bucket, file, outPath).catch(err => console.log(err));
                Compression.decodeFile(outPath, compPath);
                RSA.decryptFileContents(path.join(compPath, "decodings", fileName + "-dec.bin"), rsaPath);
                return; 
            } else {
                console.log("File with specified name not found in the bucket.");
                return; 
            }
        } else {
            console.log("Password was incorrect");
            return; 
        }
    } else {
        console.log("Bucket with that name was not found");
        return; 
    }
}
