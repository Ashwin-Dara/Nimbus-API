const fs = require("fs");
const path = require("path");
const huffman = require('./compression')

function encodeFile(filePath) {
    const bitMap = new huffman.BitCompressionMap(); 
    let freq = huffman.getFrequencyCounter(filePath); 
    // console.log("Frequency Map:", freq);
    let pq = huffman.getFreqPQ(freq);
    console.log("Priority Queue:", pq);
    let encodingTree = huffman.getHuffmanTree(pq);
    huffman.getCompressionMap(encodingTree, "", bitMap);
    console.log("=============")
    console.log("Bit Compression Map JSON:", bitMap.getJSON());
}

exports.encodeFile = encodeFile; 