import mongoose from 'mongoose';
declare global { var homebeleDb: Promise<typeof mongoose> | undefined; }
export async function connectDb() { const uri=process.env.MONGODB_URI; if(!uri) throw new Error('MongoDB is not configured'); if (!global.homebeleDb) global.homebeleDb=mongoose.connect(uri,{serverSelectionTimeoutMS:5000}).catch(e=>{ global.homebeleDb=undefined; throw e; }); return global.homebeleDb; }
const productSchema = new mongoose.Schema({slug:{type:String,unique:true,required:true},name:{en:String,ml:String,hi:String,ta:String},description:{en:String,ml:String,hi:String,ta:String},category:String,price:Number,compareAt:Number,images:[String],badge:String,featured:Boolean,active:{type:Boolean,default:false},material:String,dimensions:String,meeshoUrl:String,sourceNote:String},{timestamps:true});
export const ProductModel=mongoose.models.Product || mongoose.model('Product',productSchema);
const limitSchema=new mongoose.Schema({key:{type:String,unique:true},attempts:Number,expiresAt:{type:Date,index:{expireAfterSeconds:0}}});
export const LoginLimit=mongoose.models.LoginLimit || mongoose.model('LoginLimit',limitSchema);
