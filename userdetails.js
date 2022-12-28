const express=require("express")
const app=express();
const cors=require("cors")
const jwt=require("jsonwebtoken");
const JWT_SECRET="qawsedrfvcxz";
const mongoose=require('mongoose');
const{check, validationResult}=require("express-validator");
const { urlencoded } = require("express");
const bcrypt=require("bcryptjs")
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended:false}));
mongoose.connect("mongodb+srv://aniket282001:qwertyuiop@cluster0.7gdnt7g.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log("connected");
  });
const UserDetails=new mongoose.Schema(
    {
    Name:String,
    Email:String,
    Password:String
}
);
UserDetails.pre("save",async function(next){
    if(this.isModified("Password")){
     this.Password=await bcrypt.hash(this.Password, 10);
    }
next();
    
})

const details=mongoose.model("details",UserDetails)

app.post("/",[
    check("Name","Enter valid name").not().isEmpty(),
    check("Email","Enter valid Email").isEmail(),
    check("Password","Enter valid Pasword").isLength({min:6}),
],async function(req,res){
     const errors=validationResult(req);
     if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
     }
    const{Email,Name,Password}=req.body;
    try{
        let user=await details.findOne({
            Email
        })
        if(user){
            return res.status(400).json({
                msg:"user Exist"
            })
        }
        const submit= new details({
            Name:req.body.Name,
            Email:req.body.Email,
            Password:req.body.Password
    
        });
        const run=await submit.save();
        res.json({status:"ok"});
    } catch(err){
        console.log(err.message);
        res.status(500).send("Error in saving");
    }
    
    
})
app.post("/login",async(req,res)=>{
    const{Email,Password}=req.body;
    const auth=await details.findOne({Email});
    if(!auth){
        return res.json({error:"user not found"});
    }
    if(await bcrypt.compare(Password,auth.Password)){
        const token =jwt.sign({Email:auth.Email},JWT_SECRET);
        if(res.status(201)){
            return res.json({status:"ok",data:{token,Email:auth.Email}});
        }else{
            return res.json({error:"error"});
        }
    }
    console.log(res.json({status:"error",error:"Invalid Password"}));
})

const BlogDetail=new mongoose.Schema(
    {
    Title:String,
    Description:String,
    Image:String,
    userId:String
}

);
const blog=mongoose.model("blog",BlogDetail)
app.post("/createBlog",async(req,res)=>{
    const{Title,Description,Image,userId}=req.body;
    const submit= new blog({
        Title,
        Description,
        Image,
        userId


    });
    submit.save();
})
app.post("/myBlog",(req,res)=>{
    const userId=req.body.userId;
    blog.find({userId:userId.Email},(error,data)=>{
        if(error){
            console.log(error)
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
        
})
app.post("/myBlog/delete",(req,res)=>{
    const Id=req.body.Id;
    blog.findByIdAndDelete({_id:Id},(error,data)=>{
        if(error){
            console.log(error)
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
        
})
app.get("/allBlog",(req,res)=>{
    blog.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})
app.post("/myBlog/id",(req,res)=>{
    const Id=req.body.Id;
    //console.log(Id);
    blog.findOne({_id:Id},(error,data)=>{
        if(error){
            console.log(error)
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
        
})
app.post("/myBlog/update",async(req,res)=>{
    const{Id,Title,Description,Image}=req.body;
    blog.findByIdAndUpdate({_id:Id},{Title:Title,Description:Description,Image:Image},{new:true},(error,data)=>{
       if(error){
        console.log(error)
       }else{
        console.log(data)
       }
    })
    
})
app.listen(5000,function(req,res){
    console.log("server is listening");
})
