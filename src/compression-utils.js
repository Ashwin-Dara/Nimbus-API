const fs = require("fs");
const path = require("path");
const huffman = require("./compression");

function generateMaps(filePath, compPath) {
  /* Standard out path for every single file is a folder within
    core that contains all of the compressions. Constructing this out path.*/
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);

  /* Creating the decoding and the encoding mappings to store them into a JSON file. */
  const encPath = path.join(compPath.toString(), name + "-enc-map.json");
  const decPath = path.join(compPath.toString(), name + "-dec-map.json");

  /* Procedure for generating the huffman compression. */
  let bitMap = new huffman.BitCompressionMap();
  let freq = huffman.getFrequencyCounter(filePath);
  let pq = huffman.getFreqPQ(freq);
  let encodingTree = huffman.getHuffmanTree(pq);
  huffman.generateCompMap(encodingTree, "", bitMap);

  /* Storing the compression map within the specified folders in core. */
  let decodeMapping = bitMap.getDecodeMap();
  let encodeMapping = bitMap.getEncodeMap();

  /* Interpreting the encoding and decoding mappings. */
  const encMapJson = JSON.stringify(encodeMapping, null, 2);
  const decMapJson = JSON.stringify(decodeMapping, null, 2);

  /** Writing the encoding and the decoding map within the appropriate directories. */
  fs.writeFileSync(decPath, decMapJson);
  fs.writeFileSync(encPath, encMapJson);
}

/** Opens the file specified as a string and uses the encoding map to convert it into a
 * binary file in the appropriate path under the core data folder. */
function encodeFile(filePath, compPath) {
  /* Generating encoding and decoding maps. */
  generateMaps(filePath, compPath);

  /** Setting up the appropriate file paths for writing and retrieving
   * necessary data regarding file IO. */
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);
  let binary = "";
  let data = fs.readFileSync(filePath).toString();
  const encodingMap = JSON.parse(
    fs.readFileSync(path.join(compPath.toString(), name + "-enc-map.json"))
  );

  /* Going through the data that was read from the file. */
  for (let i = 0; i < data.length; ++i) {
    binary += encodingMap[data[i]];
  }

  /* Writing the encoding result to a binary file. */
  const outPath = path.join(
    compPath.toString(),
    "encodings",
    name + "-encoded.bin"
  );
  fs.writeFileSync(outPath, binary, { encoding: "binary" });
  console.log(binary);
}

function decodeFile(filePath, compPath, decodedPath = 0) {
  /** Setting up the appropriate file paths for writing and retrieving
   * necessary data regarding file IO. */
  let ext = path.extname(filePath);
  let name = path.basename(filePath, ext);
  const encodedPath = path.join(compPath, "encodings", name + "-encoded.bin");

  /* Checking if the user provided decoded path is valid. */
  if (decodedPath == 0) {
    decodedPath = path.join(compPath, "decodings", name + "-decoded.txt");
  }

  /* Preparing to decode the file based on the decode map that was stored within a JSON file. */
  const decodingMap = JSON.parse(
    fs.readFileSync(path.join(compPath.toString(), name + "-dec-map.json"))
  );
  let binData = fs.readFileSync(encodedPath).toString();
  let tempBin = "";
  let result = "";
  for (let i = 0; i < binData.length; ++i) {
    tempBin += binData[i];
    if (decodingMap[tempBin] !== undefined) {
      result += decodingMap[tempBin];
      tempBin = "";
    }
  }
  /* Writing the result of decoding. */
  fs.writeFile(decodedPath, result, () => {
    `Decoded the file ${name + ext}!`;
  });
}

exports.generateMaps = generateMaps;
exports.encodeFile = encodeFile;
exports.decodeFile = decodeFile;
