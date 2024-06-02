const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

module.exports = function data() {
  mongoose.connect(MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true });

  mongoose.connection.on('connected', () => {
    console.log('Mongodb is connected');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.log('Error while connecting with the database:', error.message);
  });
};
