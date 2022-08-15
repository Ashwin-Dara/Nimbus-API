const fs = require("fs");
const path = require("path");
const huffman = require('./compression')

function encodeFile(filePath, compPath) {
    /* Standard out path for every single file is a folder within
    core that contains all of the compressions. Constructing this out path.*/
    let ext = path.extname(filePath);
    let name = path.basename(filePath, ext);
    const outPath = path.join(compPath.toString(), name + "-comp$0.json");

    let bitMap = new huffman.BitCompressionMap(); 
    let freq = huffman.getFrequencyCounter(filePath); 
    let pq = huffman.getFreqPQ(freq);    
    let encodingTree = huffman.getHuffmanTree(pq);
    huffman.generateCompMap(encodingTree, "", bitMap);

    /* Storing the compression map within the specified folders in core. */
    let mapping = bitMap.getJSON()
    const jsonMap = JSON.stringify(mapping, null, 2);
    console.log(jsonMap);
    fs.writeFileSync(outPath, jsonMap)
}

exports.encodeFile = encodeFile; 