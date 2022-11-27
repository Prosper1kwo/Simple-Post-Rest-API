## install Mongoose
`npm install mongoose`

## Create BookModel under models/BookModel.js
```
// models/BookModel.js

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let bookSchema = new Schema(
    {
        id: {
            type: Number,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        author: {
            type: String,
        },
        img: {
            type: String,
        },
        status: {
            type: String,
        }
    },
    { timestamps: true }
);

let BookModel = mongoose.model("book", bookSchema);

module.exports = BookModel;
```

## config.js for db connection
```
// config.js

let config = {
    dbUrl:
      "mongodb+srv://techomoro:password@cluster0.7cpxz.mongodb.net/posts?retryWrites=true&w=majority",
  };
  
  module.exports = config;
```