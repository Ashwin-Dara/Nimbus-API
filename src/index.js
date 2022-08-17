#! /usr/bin/env node
import cli from "commander";
import createGroup from "./commands/create-group.js";
import downloadFile from "./commands/download.js";
import uploadFile from "./commands/upload.js";
import listFiles from "./commands/list-files.js";
import listBuckets from "./commands/list-buckets.js";

cli.description("One-share CLI to access and manage files stored in the cloud");

/** Command for creating a group, or creating a bucket. Will reference the exported wrapper
 * function within the create-group.js file. Requires password upon creation of the bucket to
 * store into authentication db. */
cli
  .command("cg")
  .argument("<bucketName>", "Name of the bucket that you would like to create.")
  .description("Creates a bucket within the cloud with the specified name.")
  .action(createGroup);

/** Command for listing all bucket names. Requires no authentication as the buckets
 * should be publicly visible so users are allowed to understand what groups exist. */
cli
  .command("list-buckets")
  .description("Lists all of the buckets available within the cloud.")
  .action(listBuckets);

/** Lists all of the files available within a particular bucket. Users in order to access and
 * view the files available within a bucket will need to login in. This information will be protected
 */
cli
  .command("list-files")
  .argument(
    "<bucketName>",
    "Name of the bucket that you want to view the files of."
  )
  .description("Lists all of the files available within the specified bucket.")
  .action(listFiles);

/** Uploads the file from the specified directory into the specified bucket. Requires the user
 * to re-enter the password associated with the bucket.*/
cli
  .command("upload")
  .argument(
    "<bucketName>",
    "Name of bucket you want to upload the file into.",
    "<path>",
    "Path of the file that you want to upload from"
  )
  .description("Uploads the specified file into the requested bucket.")
  .action(uploadFile);

/** Downloads the file from the requested bucket into the specified directory. Requires the user
 * to enter authentication. */
cli
  .command("download")
  .argument(
    "<bucketName>",
    "Name of bucket to download from.",
    "<fileName>",
    "Name of file to download.",
    "<outPath>",
    "Path where downloaded file should go. CWD is default."
  )
  .description(
    "Downloads a file from the requested bucket into the specified output path."
  )
  .action(downloadFile);
