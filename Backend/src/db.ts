import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type: String, required: true,unique: true},
    password:{type: String,required:true},
});

const tagSchema = new mongoose.Schema({
    title:{type:String, required:true,unique:true}
})

const contentSchema = new mongoose.Schema({
    link:{type:String,required: true},
    description:{type:String,required:true},
    title:{type:String,required:true},
    tags:[{type:Types.ObjectId,ref:'Tag'}],//If the tags are stored in a separate collection, and you want to reference them in the content schema, use ObjectId references:
    userId:{type:Types.ObjectId,ref:'User',required:true}
})

const linkSchema = new mongoose.Schema({
    hash:{type:String,required:true},
    userId:{type:Types.ObjectId,ref:'User',required:true},
    enabled:{type:Boolean}
})



export const User = mongoose.model('User',userSchema);
export const Tag = mongoose.model('Tag',tagSchema);
export const Content =  mongoose.model('Content',contentSchema);
export const Link =  mongoose.model('Link',linkSchema);