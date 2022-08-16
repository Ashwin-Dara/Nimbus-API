const fs = require("fs");
const path = require("path");
const {Storage} = require('@google-cloud/storage');
const GCS_PRIVATE = require("./private-key")

const GCS_PROJECT_ID = "gcs-oneshare";
const storage = new Storage({keyFilename:"../one-share-demo-5ad0d182bd61.json"});

async function createBucket(bucketName) {
    await storage.createBucket(bucketName);
    console.log(`Bucket ${bucketName} created.`);
  }
  
async function retrieveFile(bucket, fileName, outPath) {
    const settings = {
        destination: outPath.toString()
    }

    await storage.bucket(bucket).file(fileName).download(settings);
    console.log(`Successfully retrieved the file ${fileName}!`);
}

async function pushFile(bucket, filePath) {
    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    await storage.bucket(bucket).upload(filePath.toString(), {
        destination: name
    })
    console.log(`Successfully uploaded the file ${filePath.toString()} as ${name}!`);
}

createBucket("demo-bucket").catch(console.error);