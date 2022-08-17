const CloudUtils = require('../cloud-utils');

export default () => {
    CloudUtils.listBuckets().catch(err => console.log(err));
}