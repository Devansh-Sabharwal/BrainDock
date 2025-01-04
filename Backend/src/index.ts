import express from "express";
import * as dotenv from 'dotenv'
dotenv.config();
//require syntax ignore the types on the other hand import syntax enforce types;
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import z, { any } from "zod"
import bcrypt from "bcrypt"
import { random } from "./util";
import cors from "cors";
const JWT_SECRET = process.env.JWT_SECRET||'random';
const MONGO_URL = process.env.MONGO_URL||'random';
const PORT = process.env.PORT;
mongoose.connect(MONGO_URL);
const app = express();
import {User,Tag,Content,Link} from './db'
app.use(cors());
app.use(express.json());


app.post("/api/v1/signup",async (req,res)=>{
    const requiredBody = z.object({
        username: z
          .string()
          .min(5, { message: "Username must be 5 or more characters long" })
          .refine((val) => !/\s/.test(val), { message: "Username must not contain blank spaces" }),
        password: z
          .string()
          .min(6, { message: "Password must be at least 6 characters long" })
          .max(30, { message: "Password must be no more than 30 characters long" })
          .refine((val) => !/\s/.test(val), { message: "Password must not contain blank spaces" }),
      });
    const parsedData = requiredBody.safeParse(req.body);
    if(parsedData.success){
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password,5);

        try{
            await User.create({
                username,
                password: hashedPassword
            });
            res.status(200).json({
                message:"Your account has been created. Log in to access your dashboard"
            })
        }
        catch(e){
            res.status(400).json({message:"Username already in Use, Please log in!"});

        }
    }
    else{
        const errorMessages = parsedData.error.issues.map(issue => issue.message);
        res.status(400).json({ message: errorMessages });
        return;
    }
})
app.post("/api/v1/signin",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
        username
    })

    if(!user){
        res.status(403).json({message:"User not found. Please check your details and try again."});
        return;
    }
    const passwordMatch = await bcrypt.compare(password,user.password);
    if(passwordMatch){
        const token = jwt.sign({id:user._id},JWT_SECRET);
        res.status(200).json({token});
    }
    else{
        res.status(400).json({message:"Incorrect Password"});
        return;
    }
})
app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    //to get content of the sharedLink which will be sent in the params
    const hash = req.params.shareLink;
    try{
        const link = await Link.findOne({
            hash
        })
        if(!link){
            res.status(404).json({
                message:"invalid link"
            })
            return;
        }
        const content = await Content.find({ userId:link.userId }).populate("userId", "username").populate("tags", "title");     // Populate tags field with the title of each tag
    
            
            const formattedContent = content.map(item => ({
                ...item.toObject(),  // Convert the Mongoose document to a plain object
                tags: item.tags.map((tag: any) => tag.title)  // Extract only the titles of the tags
            }));
    
            // Respond with the formatted content
            
        const user = await User.findOne({
            _id: link.userId
        })
        if(!user){
            res.status(404).json({
                message:"User not found"
            })
            return;
        }
        res.status(200).json({
            username: user.username,
            content:formattedContent
        });
    }
    catch(e){
        res.status(500).json({message:"Server Error"});
    }
})
import auth from "./middleware";
async function createOrGetTag(title:string) {
    let tag = await Tag.findOne({ title });
    if (!tag) {
        tag = new Tag({ title });
        await tag.save();
    }
    return tag._id;
}
app.use(auth);
app.post("/api/v1/create",async (req,res)=>{
    const link = req.body.link;
    const description = req.body.description;
    const title = req.body.title;
    const tags = req.body.tags;
    const userId = req.userId;
    const tagIds = [];
    for (const tagTitle of tags) {
        const tagId = await createOrGetTag(tagTitle);
        tagIds.push(tagId);
    }
    try{
    await Content.create({
        link,description,title,tags:tagIds,userId
    })
    res.status(200).json({message:"Content Posted Successfully"});
    return;
    }
    catch(e){
        res.status(500).json({message:"Unable to create content. Some required fields are missing."});
        return;
    }
})

app.get("/api/v1/get",async (req,res)=>{
    const userId = req.userId;
    try{
        const content = await Content.find({ userId })
            .populate("userId", "username")  // Populate userId field with the username
            .populate("tags", "title");     // Populate tags field with the title of each tag

        
        const formattedContent = content.map(item => ({
            ...item.toObject(),  // Convert the Mongoose document to a plain object
            tags: item.tags.map((tag: any) => tag.title)  // Extract only the titles of the tags
        }));

        // Respond with the formatted content
        res.status(200).json({ content: formattedContent });

    }
    catch(e){
        res.status(500).json({"message": "Server Error"});
    }
    
    
})
app.delete("/api/v1/delete",async (req,res)=>{
    const contentId = req.body.contentId;

    try {
        const result = await Content.deleteOne({
            _id:contentId,
            userId: req.userId
        });
    
        if (result.deletedCount > 0) {
            res.json({ message: "Content deleted successfully." });
        } else {
            res.status(404).json({ message: "No content found to delete." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting content." });
    }
    
    
})
app.post("/api/v1/brain/status",async (req,res)=>{
    const userId = req.userId;
    try{
        const link = await Link.findOne({ userId });
        if(link){
            res.status(200).json({ hash: link.hash,enabled:true });
        }
        else{
            res.status(200).json({ hash:"No Link to Share",enabled:false });
        }
    }
    catch(e){
        res.status(500).json({message:"Server Error"});
    }
    
})
app.post("/api/v1/brain/share",async (req,res)=>{
    const share  = req.body.share;
    if(share){
        const userId = req.userId;
        try{
            const existingLink = await Link.findOne({ userId});
            if (existingLink) {
                res.status(200).json({ hash: existingLink.hash }); // Send existing hash if found.
                return;
            }
            const hash = random(userId);
            await Link.create({userId,hash,enabled:true});
            res.status(200).json({hash});
        }
        catch(e){
            res.status(500).json({message:"Server Error"});
        }
        
    }
    else{
        try{
            await Link.deleteOne({userId:req.userId});
            res.status(200).json({hash:"No Link to Share"});
        }
        catch(e){
            res.status(500).json({message:"Server Error"});
        }
    }
})

app.post('/api/v1/content/tag', async (req, res) => {
    try {
      const tagTitle  = req.body.title;
      const userId = req.userId;
      if(tagTitle=="All"){
        try{
            const content = await Content.find({ userId })
                .populate("userId", "username")  // Populate userId field with the username
                .populate("tags", "title");     // Populate tags field with the title of each tag
    
            
            const formattedContent = content.map(item => ({
                ...item.toObject(),  // Convert the Mongoose document to a plain object
                tags: item.tags.map((tag: any) => tag.title)  // Extract only the titles of the tags
            }));
    
            // Respond with the formatted content
            res.status(200).json({ content: formattedContent });
            return;
    
        }
        catch(e){
            res.status(500).json({"message": "Server Error"});
        }
      }
      const tag = await Tag.findOne({ title: tagTitle });
      if (!tag) {
         res.status(404).json({ message: 'Tag not found' });
         return;
      }
      const content = await Content.find({ tags: tag._id,userId }).populate("userId", "username").populate("tags", "title"); 
  
      const formattedContent = content.map(item => ({
        ...item.toObject(),  // Convert the Mongoose document to a plain object
        tags: item.tags.map((tag: any) => tag.title)  // Extract only the titles of the tags
    }));

    // Respond with the formatted content
    res.status(200).json({ content: formattedContent });
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
  });
app.listen(PORT, () => {
    console.log("Server is Listening...")
})