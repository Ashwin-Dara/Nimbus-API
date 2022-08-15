const fs = require("fs");
const path = require("path");
const encUtils = require('../../compression-utils')
const compPath = path.join("..", "..", "core", "compression")

const testFile = path.join("..", "..", "..", "tests-in", "compression-test-in", "test-mapping-in-1.txt");
encUtils.encodeFile(testFile, compPath);
