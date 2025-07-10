import mongoose from 'mongoose';


const connectDB = async ()=>{
    try{
        const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/twodo';
        await mongoose.connect(URI);

    }catch(err){
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;