const fs = require('fs')
const path = require('path')

class BitCompressionMap {
  constructor() {
    this.decodeMapping = new Map(); 
  }

  /** Adds the node into the BitCompressionMap. Typically, one file will have one single
   * BitCompressionMap associated with it. The map itself can be stored as text but will follow
   * a JSON-esque format.
   */
  addBitNode(node) {
    this.decodeMapping.set(node.getCharacter(), node.getBitString());
  }

  /** Returns the JSON representation of the BitCompressionMap.
   * This is what the key:value structure will look like. Keys will be the letter,
   * and values will be the binary number representation that letter (bitstring).
   * An example mapping may look like the following:
   *    { A:1010,
   *      B:0001 }
   */
  getJSON() {
    let o = Object.fromEntries(this.decodeMapping);
    let oJson = JSON.stringify(o);
    return oJson; 
  }
}

class BitNode {
  /** Variables:
   *  - bitString: represents the compressed bit sequence associated with the letter.
   *  - frequency: number of times this sequence has shown up within the .bin file.
   *  - character: this is the character that the BitNode represents.
   *  - left and right: children of the tree.
   */
  constructor() {
    this.bitString = 0;
    this.frequency = 0;
    this.character = "";
    this.left = null;
    this.right = null;
  }

  getRepresentation() {
    return [this.character, this.bitString];
  }

  getCharacter() {
    return this.character;
  }

  getBitString() {
    return this.bitString;
  }

  getFreq() {
    return this.frequency; 
  }

}


/** Takes in a file path, reads all of the contents, and then returns a frequency map 
 * containing the frequency of every single character within the specified file.
 */
function getFrequencyCounter(filePath) {
  /* Reading the specified file and converting it into a string. */
  const data = fs.readSync(filePath).toString(); 

  /* Object holds the frequency of the different characters. */
  let freq = {}; 
  
  for (let i=0; i < data.length; ++i) {
    let c = data.charAt(i);
    if (freq[c]) {
      freq[c] ++; 
    } else {
      freq[c] = 1;
    }
  }

  /* Returning a javascript object containing the frequency of every single letter 
  found within the specified file. */
  return freq; 
}

/** Input: freqMap - javascript object that contains the frequency of every character within a particular file. 
 * This will typically be generated using the "getFrequencyCounter" function. 
 * 
 * Output: min-heap priority queue containing "BitNode" objects within the pq.  
 */
function getFreqPQ(freqMap) {
  /* */
  let pq = []; 

  for (const letter in freqMap) {
    let node = new BitNode(); 
    node.character = letter; 
    node.frequency = freqMap[letter];
    pq.push(node)
  }

  pq.sort((first, second) => {return first.frequency - second.frequency; });
  return pq; 
}

function getHuffmanTree(prioQ) {
  let treeRoot = null; 

  while (prioQ.length > 1) {
    let first = prioQ[0]; 
    prioQ.shift(); 

    let second = prioQ[0]; 
    prioQ.shift(); 

    let parent = BitNode(); 
    parent.character = first.getCharacter() + " - " +  second.getCharacter();  
    parent.frequency = first.getFreq() + second.getFreq(); 

    parent.left = first; 
    parent.right = second; 

    treeRoot = parent; 
    
    prioQ.push(parent);
    prioQ.sort((first, second) => {return first.frequency - second.frequency; });
  }
  return treeRoot;
}

/** 
 * Input: Huffman Tree. 
 * Output: BitCompressionMap object. 
 * 
 * Takes in the root of a Huffman tree and converts it into a valid CompressionMap object. 
 * The typical workflow for generating a valid compression encoding would first be to read the 
 * file, then it would be to 
 */
function getCompressionMap() {

}