class BitCompressionMap {
  constructor() {
    this.mapping = [];
  }

  /** Adds the node into the BitCompressionMap. Typically, one file will have one single
   * BitCompressionMap associated with it. The map itself can be stored as text but will follow
   * a JSON-esque format.
   */
  addBitNode(node) {
    let rep = node.getRepresentation();
    this.mapping.push(rep);
  }

  /** Returns the JSON representation of the BitCompressionMap.
   * This is what the key:value structure will look like. Keys will be the letter,
   * and values will be the binary number representation that letter (bitstring).
   * An example mapping may look like the following:
   *    { A:1010,
   *      B:0001 }
   */
  getJSON() {
    // @TODO
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
}

let b = new BitNode();
b.bitString = 100;
console.log(b.getArea(b.bitString));
