# One-Share - Simplified Cloud API
[![issues](https://img.shields.io/github/issues/ashwin-dara/one-share.svg?style=flat)](https://github.com/Ashwin-Dara/One-Share/issues)
[![npm package](https://img.shields.io/badge/npm%20package-8.11.0-brightgreen)](https://github.com/Ashwin-Dara/One-Share)
[![dependencies](https://img.shields.io/badge/dependencies-up--to--date-blue)](https://github.com/Ashwin-Dara/One-Share/blob/master/package.json)

- [One-Share 🌨️ - Cloud Creation Software](#one-share-️---cloud-creation-software)
  - [Installation](#installation)
  - [Usage Overview](#usage-overview)
  - [Commands](#commands)
    - [Creating New Bucket](#creating-new-bucket)
    - [Viewing Buckets](#viewing-buckets)
    - [Viewing Files](#viewing-files)
    - [Uploading File](#uploading-file)
    - [Downloading File](#downloading-file)
  - [File Structure](#file-structure)
    - [Core Structure](#core-structure)
  - [Resources](#resources)

One-Share is a cloud creation software that allows you to easily manage files into a cloud without having you to worry about any of the stressors that come with the logistics of setting up the entire system by yourself. One-share has serverless architecture and is flexible in meeting the needs of users as it is built using the Google Cloud Services API. Users may purchase the service plan depending on their usages.

Furthermore, One-Share handles security for you with RSA encryption and is equipped with a fast asynchronous design to give fast feel when it comes to transferring large files. Moreover, there is built-in "bucket" authentication to prevent certain files from being accessed if they fall into unapproved hands. 

## Installation

All dependencies are already handled by the Node package manager. Verify that node is installed by running the command `node --version` within your terminal. If a version is not detected, please install node. Installation for node depends on the machine you are using. Here is a link to reference: https://nodejs.org/en/download/.

First, clone this repository into your choice of directory to get all of the application files: 
```bash
$ cd <path>
$ git clone git@github.com:Ashwin-Dara/One-Share.git
```

After cloning the application, verify that all files were downloaded. Afterwards, navigate to your directory where the application was installed and run the following command: 

```bash
$ npm install
```

If you wish to install the packages globally (not recommended due to dependency conflicts), run the command `npm install` with an additional `-g` flag at the end. 

## Usage Overview

One-Share is a tool built for the terminal, and there are only a handful of operations needed to effectively handle the pushing, deletion, and pulling of files into the cloud. All miscellaneous features such as data compression, encryption, and authentication are handled in the background. 

The overall structure is that the cloud has "buckets." They can be thought of as over-arching directories. Each one of these buckets can store files, folders, etc., and One-Share makes it so that buckets can be secured by requiring login authentication. Also, to always have understand of what files are stored within each bucket and what buckets are available, there are supported commands to view all files/buckets, similar to the already familiar `ls` commands available in most machines. 

Currently, the repository holds a version of One-Share with no licenses bought. If you wish to purchase your own license, please do that through the Google Cloud services and replace the JSON file named "one-share-demo-5ad..." with the keys associated with your subscription. 

## Commands

### Creating New Bucket
Buckets are essentially the equivalent of "groups." They are places where files can be stored, and in order to access a bucket, authentication is required. This makes storing files in buckets secure and allows for an easy way to share resources. Creating a bucket can be done with the following command: 

```bash
$ oneshare cg <bucket name>
```
- `cg`: standards for "create group". 
- `<bucket name>`: the name you wish to assign to the bucket. 

This command will require the user to enter a password associated with the bucket upon creation. This password will be used to perform any tasks related to the bucket. 

### Viewing Buckets
To view all possible buckets that have been created, type the following command: 
```bash
$ oneshare list-buckets
```
This command requires no authentication as what buckets/groups exist should require no additional security measures for maintaining data integrity.


### Viewing Files
To view all files belonging to a particular bucket, run the following command: 
```bash
$ oneshare list-files <bucketName>
```
- `<bucketName>`: name of the bucket that you want to view the files of. In order to view the files within the bucket, the corresponding password for that bucket will need to be entered. 


### Uploading File
To upload a file into a particular bucket, run the following command: 
```bash
$ oneshare upload <bucketName> <path>
```
- `<bucketName>`: name of the bucket to upload the file into. Authentication will be required when files will be attempted to upload. 
- `<path>`: path of the file requested to be uploaded. 

### Downloading File
To download a file from a particular bucket into a directory of your choice, run the following: 
```bash
$ oneshare download <bucketName> <fileName> [outPath]
```
- `<bucketName>`: name of the bucket you wish to pull the file from. Note that in order to pull the requested file, authentication will be required. 
- `<fileName>`: name of the file you wish to retrieve from the cloud. 
- `[outPath]`: path that the file will be downloaded into. By default, if not specified, the file will be downloaded into the current working directory.

## File Structure
One-share handles all meta-data related to files within a particular folder named "core." This is located at "One-Share/src/core." The core folder handles all intermediate information that is necessary to provide the functionality of compression and encryption. The core folder stores compressed versions of the file alongside with the required mapping needed to decode it. It also stores the encrypted version of the files to be uploaded. It is important to not modify the core folder.
### Core Structure
```
Input: test.txt 

src/core
    /compression
        /encodings
            # stores binary file encoding of all encoded files
            - text-enc$0.bin
        /decodings
            # stores all decodings pulled from the cloud
            - text-dec$0.txt
        # stores mapping required for decoding and encoding
        - test-dec-map.json
        - test-enc-map.json
    /rsa
        /decryptions
            # stores all decrypted files pulled from cloud
            - test-enc-decrypted.txt
        /encryptions   
            # stores all encrypted files
            - test-enc-$0.txt
        # stores relevant keys
        -private.pem
        -public.pem
        -rsa-settings.json
```

---
## Resources
- https://cloud.google.com/storage
- https://en.wikipedia.org/wiki/Huffman_coding
- https://www.sohamkamani.com/nodejs/rsa-encryption/
- https://www.learnhowtoprogram.com/ruby-and-rails/authentication-and-authorization/authentication-with-bcrypt
- https://brilliant.org/wiki/rsa-encryption/
- https://en.wikipedia.org/wiki/Salt_(cryptography)
- https://www.youtube.com/watch?v=dM6us854Jk0
