const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const prompt = require('prompt-sync')();
const bcrypt = require("bcrypt");
const { Storage } = require("@google-cloud/storage");
const GCS_PRIVATE = require("./private-key");
const FileSchema = require("./file-model");
const BucketSchema = require('./bucket-model');


/* Setting up the MongoDB Atlas database and connecting to the database. */
const DB_URI = "placeholder-mongodb-uri";
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Connected to the database.");
  })
  .catch((err) => {
    console.log(err);
  });

/* Writing relevant information needed for the set up for the google cloud 
service. The private key is a demo and stored within the file indicated in the 
next 2 lines. */
const GCS_PROJECT_ID = "gcs-oneshare";
const storage = new Storage({
  keyFilename: "../one-share-demo-5ad0d182bd61.json",
});

/** Gets a list of buckets for the user to view. Does not require any 
 * parameters as this is a non-restrictive function that does not require auth. */
async function listBuckets() {
  /* Creating set to keep track of buckets that were already seen. */
  const bucketNames = new Set();

  /* Querying through all documents. If one has a bucket that is not seen, 
  we print that bucket. */
  FileSchema.find()
    .then((result) => {
      if (!bucketNames.has(result.bucket)) {
        console.log("All Buckets:", result.bucket);
        bucketNames.add(result.bucket);
      }
    })
    .catch((err) => console.log(err));
}

/** Lists all of the files within the particular bucket. 
 * This function requires a password in order to check whether or not the 
 * user is able to view into the files within that bucket. */
async function listFiles(bucketName) {
  FileSchema.find({ bucket: bucketName })
    .then((result) => {
      console.log(result.name);
    })
    .catch((err) => console.log(err));
}

/** Creates a bucket within the storage name. Equivalent of a "group". 
 * Will prompt the user to enter in a password to be associated with the bucket
 * and will store the hash of this password within the database.*/
async function createBucket(bucketName) {

  const bucket = new BucketSchema.BucketDocument();
  bucket.name = bucketName; 

  const pass = prompt("Enter a password associated with this bucket:");
  const pass2 = prompt("Re-type your password to confirm it:");
  
  if (pass2 !== pass) {
    console.log("The passwords don't match.");
    return; 
  }

  const salt = await bcrypt.genSalt(10);
  bucket.authHash = await bcrypt.hash(pass, salt);
  
  await storage.createBucket(bucketName);
  bucket.save().catch(err => console.log(err)); 
  console.log(`Bucket ${bucketName} created and password configured!`);
}

/** Pulls the specified file with "fileName" from the appropriate bucket and
 * places it into the specified outPath. */
async function retrieveFile(bucket, fileName, outPath) {
  const settings = {
    destination: outPath.toString(),
  };
  await storage.bucket(bucket).file(fileName).download(settings);
  /* Printing success status. */
  console.log(`Successfully retrieved the file ${fileName}!`);
}

/** Pushes the specified filePath into the specified bucket or "group". 
 * Look at the following to see an example of bcrypt auth: 
 * https://www.loginradius.com/blog/engineering/hashing-user-passwords-using-bcryptjs/
*/
async function pushFile(bucket, filePath) {
  /* Making preparations for extracting information about the file
  and storing any relevant meta data. */
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);
  let stats = fs.statSync(filePath.toString());
  let sizeBytes = stats.size;

  /* Creating a file model based on the meta data that was collected. */
  const file = new FileSchema.FileDocument({
    name: name.toString(),
    bucket: bucket.toString(),
    size: Number(sizeBytes),
  });

  /* Async uploading the file into the bucket. */
  await storage.bucket(bucket).upload(filePath.toString(), {
    destination: name,
  });

  /* Saving the file document within the database (async). */
  file.save().then((result) => {}).catch((err) => {console.log(err)});
  /* Printing success status. */
  console.log(
    `Successfully uploaded the file ${filePath.toString()} as ${name}!`
  );
}

exports.listBuckets = listBuckets;
exports.listFiles = listFiles; 
exports.createBucket = createBucket;
exports.retrieveFile = retrieveFile; 
exports.pushFile = pushFile;