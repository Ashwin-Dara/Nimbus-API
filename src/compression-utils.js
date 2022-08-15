const fs = require("fs");
const path = require("path");
const { decode } = require("punycode");
const huffman = require('./compression')

function generateMaps(filePath, compPath) {
    /* Standard out path for every single file is a folder within
    core that contains all of the compressions. Constructing this out path.*/
    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    const encPath = path.join(compPath.toString(), name + "-enc-map.json");
    const decPath = path.join(compPath.toString(), name + "-dec-map.json");

    let bitMap = new huffman.BitCompressionMap(); 
    let freq = huffman.getFrequencyCounter(filePath); 
    let pq = huffman.getFreqPQ(freq);    
    let encodingTree = huffman.getHuffmanTree(pq);
    huffman.generateCompMap(encodingTree, "", bitMap);

    /* Storing the compression map within the specified folders in core. */
    let decodeMapping = bitMap.getDecodeMap();
    let encodeMapping = bitMap.getEncodeMap(); 
    const encMapJson = JSON.stringify(encodeMapping, null, 2);
    const decMapJson = JSON.stringify(decodeMapping, null, 2);

    /** Writing the encoding and the decoding map within the appropriate directories. */
    fs.writeFileSync(decPath, decMapJson);
    fs.writeFileSync(encPath, encMapJson);
}

/** Opens the file specified as a string and uses the encoding map to convert it into a 
 * binary file in the appropriate path under the core data folder. */
function encodeFile(filePath, compPath) {

    generateMaps(filePath, compPath);

    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    let binary = "";
    let data = fs.readFileSync(filePath).toString(); 
    const encodingMap = JSON.parse(fs.readFileSync(path.join(compPath.toString(), name + "-enc-map.json")));
    
    for (let i=0; i < data.length; ++i) {
        binary += encodingMap[data[i]];
    }

    const outPath = path.join(compPath.toString(), "encodings", name + "-encoded.bin");
    fs.writeFileSync(outPath, binary);
    console.log(binary);
}

function decodeFile(filePath, compPath, decodedPath=0) {
    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    const encodedPath = path.join(compPath, "encodings", name + "-encoded.bin");

    if (decodedPath == 0) {
        decodedPath = path.join(compPath, "decodings", name + "-decoded.txt");
    }
    const decodingMap = JSON.parse(fs.readFileSync(path.join(compPath.toString(), name + "-dec-map.json")));
    let binData = fs.readFileSync(encodedPath).toString(); 
    let tempBin = ""
    let result = "";
    for (let i=0; i < binData.length; ++i) {
        tempBin += binData[i]
        if (decodingMap[tempBin] !== undefined) {
            result += decodingMap[tempBin];
            tempBin = "";
        }
    }
    console.log(result);
    fs.writeFile(decodedPath, result, ()=>{`Decoded the file ${name + ext}!`})
}

exports.generateMaps = generateMaps; 
exports.encodeFile = encodeFile;
exports.decodeFile = decodeFile; 