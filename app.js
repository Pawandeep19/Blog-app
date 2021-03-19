var express=require("express");
var app=express();
methodOverride=require("method-override");
app.use(methodOverride("_method"));
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/Pawan_Blog_App",{ useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});
mongoose.set('useFindAndModify', false);
var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    description:String
});

var Blog=mongoose.model("Blog",blogSchema);

//will use the restful routing conventions see table for more info

//main route(index)
app.get("/blog",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index.ejs",{blogs:blogs});
        }
    })
    
});

//create(index post route)
app.post("/blog",function(req,res){
    var title=req.body.title;
    var imageurl=req.body.image;
    var desc=req.body.description;
    var newblog={
        title:title,
        image:imageurl,
        description:desc
    };
    Blog.create(newblog,function(err,nb){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blog");
        }
    });
});

//new post route(newBlog)
app.get("/blog/new",function(req,res){
    res.render("newBlog.ejs");
});

//show route(showPage)
app.get("/blog/:id",function(req,res){
    var blogID=req.params.id;
    Blog.findById(blogID,function(err,foundblog){
        if(err){
            console.log(err);
        }
        else{
            res.render("showPage.ejs",{foundblog:foundblog});
        }
    });

});
//edit route(editPage)
app.get("/blog/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("editPage.ejs",{blog:blog});
        }

    });
});

//update route
app.put("/blog/:id",function(req,res){
    var title=req.body.title;
    var imageurl=req.body.image;
    var desc=req.body.description;
    var updatedBlog={
        title:title,
        image:imageurl,
        description:desc
    };
     Blog.findByIdAndUpdate(req.params.id,updatedBlog,function(err,upBlog){
         if(err){
             res.redirect("/blog");
         }
         else{
             res.redirect("/blog/"+req.params.id);
         }
     });
});

//delete route
app.delete("/blog/:id",function(req,res){
     Blog.findByIdAndRemove(req.params.id,function(err){
         if(err){
             res.redirect("/blog");
         }
         else{
             res.redirect("/blog");
         }
     });
});

//listen
app.listen(3000,function(){
    console.log("Server is starting..")
})