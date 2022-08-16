const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const GCS_PRIVATE = require("./private-key");

/* Writing relevant information needed for the set up for the google cloud 
service. The private key is a demo and stored within the file indicated in the 
next 2 lines. */
const GCS_PROJECT_ID = "gcs-oneshare";
const storage = new Storage({
  keyFilename: "../one-share-demo-5ad0d182bd61.json",
});

/** Creates a bucket within the storage name. Equivalent of a "group". */
async function createBucket(bucketName) {
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
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

/** Pushes the specified filePath into the specified bucket or "group". */
async function pushFile(bucket, filePath) {
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);
  await storage.bucket(bucket).upload(filePath.toString(), {
    destination: name,
  });
  /* Printing success status. */
  console.log(
    `Successfully uploaded the file ${filePath.toString()} as ${name}!`
  );
}

// createBucket("demo-bucket").catch(console.error);
