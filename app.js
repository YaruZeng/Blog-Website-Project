//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');


const homeStartingContent =
  "Welcome to the blog website. Click 'Compose' on the navigation bar to post. ";
const aboutContent =
  "This is a blog website with features of posting and browsing blogs. ";
const contactContent =
  "For any use of the Website, please contact me at yaruzengivy@outlook.com. ";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb+srv://Cluster93867:7dsey7qmxjuawLoL@cluster93867.fih7cgh.mongodb.net/postDB", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));


const postsSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postsSchema);

// let postArray = [];

app.get("/", (req, res) => {
  Post.find({})
  .then((foundItems) => {
    res.render("home.ejs", {
      startingContent: homeStartingContent,
      posts: foundItems,
    });
  })
  .catch((error) => {
    console.log(error);
  })
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { contactContent: contactContent });
});

app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId})
  .then((foundItem) => {
    // res.render("post.ejs", {title: foundItem.title, content: foundItem.content});
    res.render("post.ejs", {title: foundItem.title, content: foundItem.content});
  })
  .catch((error) => {
    console.log(error);
  })
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
  });
  // postArray.push(post);
  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch((error) => {
    console.log(error);
  });
  
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started successfully!");
});
