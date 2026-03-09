const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://manueltxt12_db_user:1234@cluster0.xeqofvb.mongodb.net/?appName=Cluster0');
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
    };

module.exports = connectDB;