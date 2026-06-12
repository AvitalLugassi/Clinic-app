import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err);
    }
};

export default connectMongo;
