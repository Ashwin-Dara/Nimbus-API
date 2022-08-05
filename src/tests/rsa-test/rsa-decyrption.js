const rsa = require('../../rsa-algorithm')
const path = require("path");

rsa.encryptFile(path.join("../", "test-data-1.txt"), path.join("../", "../", "core", "rsa", "rsa-info.json"), path.join("../", "out", "test-data-1-bin.txt"));
rsa.decryptFile(path.join("../", "out", "test-data-1-bin.txt"), path.join("../", "../", "core", "rsa", "rsa-info.json"), path.join("../", "out", "test-data-1-decrypted.txt"));
