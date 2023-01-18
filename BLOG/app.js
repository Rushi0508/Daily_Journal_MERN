//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require('mongoose')

const homeStartingContent = "Hello, this a Daily Journaling Web App used to journal your daily activites and keep track of it.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
// Setting Up connection
mongoose.connect('mongodb://localhost:27017/blogDB' , {useNewUrlParser: true}).then(()=>{
    console.log("Mongo Connected");
}).catch(err=>{
    console.log("OH error");
    console.log(err);
});

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);


app.get("/", (req,res)=>{
  Post.find({}, (err, posts)=>{
    res.render("home", {startingContent: homeStartingContent ,posts: posts});
  })
})
app.get("/about", (req,res)=>{
  res.render("about", {aboutContent: aboutContent});
})
app.get("/compose", (req,res)=>{
  res.render("compose");
})
app.post("/compose", (req,res)=>{
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
})
  
app.get("/posts/:postId", (req,res)=>{
  let reqId = req.params.postId
  
  Post.findOne({_id: reqId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
})











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
