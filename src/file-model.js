const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Creating generic information needed for us to query through the database. 
All of the support functionality by One Share will only require three pieces of information
related to the file. The name of the file, what bucket it belongs to, nd the size of the 
file, which is optional. */
const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    size: Number,
  },
  { timestamps: true }
);

/* Name of the collection within the DB is "files". Caps is handled and plural is not needed. */
const FileDocument = mongoose.model("File");
/* Preparing the model for export. */
exports.FileDocument = FileDocument;
