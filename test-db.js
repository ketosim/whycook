import mongoose from 'mongoose';

const uri = "mongodb+srv://simoley:huber@cluster0.ewnno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const testConnection = async () => {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(uri, {
      family: 4,  // Force IPv4
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('Connected successfully!');
  } catch (err) {
    console.error('Connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      syscall: err.syscall,
      hostname: err.hostname
    });
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();