const mongoose=require('mongoose')
const { Schema } = mongoose;
//creating Schema
const userSchema = new Schema({
   name:{
    type:String,
    required:true
   },
   password:{
    type:String,
    require:true
   },
   email:{
     type:String,
     required:true,
   },
   date:{
    type:String,
    default:new Date
   }
   
});
module.exports=mongoose.model('User',userSchema) //confirmed model based on schema