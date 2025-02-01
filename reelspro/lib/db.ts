import mongoose from "mongoose";
import { buffer } from "stream/consumers";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri in env file");
}


let cached = global.mongoose;
if(!cached){
  cached = global.mongoose = { conn: null, promise: null };
}
export async function connecttoDatabase(){
    if (cached.conn) {
        return cached.conn;
    }

    if(!cached.promise){
    const opts ={
        bufferCommands: true,
        maxPoolSize: 10,
    }
    
    cached.promise = mongoose
    .connect(MONGODB_URI,opts)
    .then(() => mongoose.connection);
}
   try{
        cached.conn = await cached.promise;        
   }
   catch(error){
    cached.promise = null;
    throw new Error("Failed to connect to the database");
   }
   return cached.conn;
}   
