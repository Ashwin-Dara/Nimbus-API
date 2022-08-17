const CloudUtils = require('../cloud-utils');

export default (bucketName) => {
    CloudUtils.createBucket(bucketName).catch(err => console.log(err));
}