const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** This model will primarily be concerned with storing the information
 * needed to determine whether or not someone has permission to upload to a
 * particular bucket. We will be storing the bucket name and the hash associated
 * with that bucket when we create a new bucket using the `cg` command.
 */

const bucketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  authHash: {
    type: String,
    required: true,
  },
});

/* Name of the collection within the DB is "buckets." */
const BucketDocument = mongoose.model("Bucket");
/* Preparing the model for export. */
exports.BucketDocument = BucketDocument;
