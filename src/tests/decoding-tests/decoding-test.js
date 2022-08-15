const fs = require("fs");
const path = require("path");
const encUtils = require('../../compression-utils')
const compPath = path.join("compression")

for (let i=1; i < 5; ++i) {
    const testFile = path.join("..", "..", "..", "tests-in", "compression-test-in", "test-mapping-in-" + i + ".txt");
    encUtils.decodeFile(testFile, compPath);
}