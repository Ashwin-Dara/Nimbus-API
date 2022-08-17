const CloudUtils = require('../cloud-utils');
const bcrypt = require("bcrypt");

export default (bucketName, options) => {
    const login = prompt("Enter the password for this bucket:");
    const bucket = await CloudUtils.BucketSchema.findOne({ bucket: bucketName });
    if (bucket) {
        const valid = await bcrypt.compare(login, bucket.authHash);
        if (valid) {
            CloudUtils.listFiles(bucketName).catch(err => console.log(err));
            return; 
        } else {
            console.log("Password was incorrect.");
            return; 
        }
    } else {
        console.log("Bucket with that name was not found.");
        return; 
    }
}