const rsa = require('../../rsa-algorithm')
const path = require("path");

let encData = path.join("../", "../", "core", "rsa", "rsa-info.json")

rsa.encryptFile(path.join("../", "test-data-1.txt"), encData, path.join("../", "out", "test-data-1-bin.txt"))
rsa.encryptFile(path.join("../", "test-data-2.txt"), encData, path.join("../", "out", "test-data-2-bin.txt"))