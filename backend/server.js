
/** Reference code: https://github.com/bpeddapudi/nodejs-basics-routes/blob/master/server.js 
 * import express */
const express = require('express');
const cors = require('cors');
// middleware
const app = express();
app.use(express.json());
app.use(cors())

// `npm install mongoose`
const mongoose = require("mongoose");
const options = {
    keepAlive: true,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// mongodb+srv://<username>:<password>@cluster0.6vk0qgz.mongodb.net/?retryWrites=true&w=majority
// You guys need to replace with your own server url and correct <username> and <password>
const dbUrl = // mongodb+srv://<username>:<password>@cluster0.6vk0qgz.mongodb.net/?retryWrites=true&w=majority;
 

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
    if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Mongo DB Connected successfully");
});

// Schema for Post
let Schema = mongoose.Schema;

let postSchema = new Schema({
                post: {
                    type: String,
                },
}, { timestamps: true }

);
let postModel = mongoose.model("post", postSchema);


// Mock Data : We will stop using this static data and will add and remove data from DB itself
let myMockDB = [
    {
        id: 1,
        post: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, voluptatibus corporis! Deserunt doloribus unde magnam, iusto officia cum commodi praesentium?',
    },
    {
        id: 2,
        post: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, voluptatibus corporis! Deserunt doloribus unde magnam, iusto officia cum commodi praesentium?',
  
    },
    {
        id: 2,
        post: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, voluptatibus corporis! Deserunt doloribus unde magnam, iusto officia cum commodi praesentium?',

    }
]

app.get('/', (req, res) => {
    res.send('Your are lucky!! server is running...');
});



/** GET API: GETs posts from DB and returns as response */
app.get('/posts', async (req, res) => {
    try {
        let posts = await postModel.find().sort({createdAt: -1});
        res.status(200).json({
            status: 200,
            data: posts,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});



 /** POST API: Gets new post info from React and adds it to DB */


/** POST API: Gets new post info from React and adds it to DB */
app.post('/addpost', async (req, res) => {
    const inputpost = req.body;
    console.log(inputpost);
    const matchingposts = myMockDB.filter(post => post.id === inputpost.id).length;
    if (matchingposts) {
        res.status(500);
        console.error(`post with id:${inputpost.id} already exists`);
    } else {
        myMockDB.push(req.body);
    }
    try {
        console.log('input post:', inputpost);
        let post = new postModel(inputpost);
        post = await post.save();
        res.status(200).json({
            status: 200,
            data: post,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});


app.put("/posts/:postId", async (req, res) => {
    try {
        console.log('PUT request..:' + req.params.postId);
        let newpost = req.body;
        console.log(JSON.stringify('Req body:', JSON.stringify(newpost)));
        /** There is BUG, Data is not getting updated in DB for me */
        let post = await postModel.findByIdAndUpdate({ _id: req.params.postId }, req.body, {
            new: true,
        }).catch((err) => {
            console.error('Error-----------------', err);
        });
        if (post) {
            console.log(JSON.stringify(post));
            res.status(200).json({
                status: 200,
                data: post,
            });
        }
        res.status(400).json({
            status: 400,
            message: "No post found",
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});


/** DELETE API: Gets ID of the post to be deleted from React and deletes the post in db. 
 * Sends 400 if there is no post with given id
 * Sends 500 if there is an error while saving data to DB
 * Sends 200 if deleted successfully
 */
app.delete("/posts/:postId", async (req, res) => {
    try {
        let post = await postModel.findByIdAndRemove(req.params.postId);
        if (post) {
            res.status(200).json({
                status: 200,
                message: "post deleted successfully",
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "No post found",
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

app.get('/loadSamplePosts', async (req, res) => {
    try {
        myMockDB.forEach(async (postIn) => {
            let post = new postModel(postIn);
            post = await post.save();
        });
        res.status(200).json({
            status: 200,
            data: myMockDB,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

app.listen(3001);