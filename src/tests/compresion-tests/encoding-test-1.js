const fs = require("fs");
const path = require("path");
const encUtils = require('../../compression-utils')

const testFile = path.join("..", "..", "..", "tests-in", "compression-test-in", "test-mapping-in-1.txt");
encUtils.encodeFile(testFile);
