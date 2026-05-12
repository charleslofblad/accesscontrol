const mongoose = require('mongoose');
var gracefulShutdown;
//var dbURI = 'mongodb://localhost/priceexhange';
var dbURI = process.env.MONGODB_URI; //2018 från sista fungerande inst
//var dbURI = 'mongodb+srv://charleslofblad:pappa44@cluster0.x68ds.mongodb.net/priceexhange?retryWrites=true&w=majority';
//const dbURI = 'mongodb://charleslofblad:pappa44@cluster0-shard-00-00.x68ds.mongodb.net:27017,cluster0-shard-00-01.x68ds.mongodb.net:27017,cluster0-shard-00-02.x68ds.mongodb.net:27017/priceexhange?ssl=true&replicaSet=atlas-3dedec-shard-0&authSource=admin&retryWrites=true&w=majority';
// const readLine = require('readline');

//MONGODB_URI=mongodb://localhost/priceexhange


/* Tog bort för Atlas version då det är samma db lokalt....
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}
*/




// version atlas 1
const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {
        useCreateIndex: true,
        useFindAndModify: false, //kolla om det ska vara false
        useNewUrlParser: true ,
        useUnifiedTopology: true
        
    }), 1000);
  }

    mongoose.connection.on('connected', function () {
      console.log('Use The forse Charlie !!!  Mongoose connected to ' + dbURI);
    });
    mongoose.connection.on('error',function (err) {
      console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose disconnected');
    });
    
    

    // CAPTURE APP TERMINATION / RESTART EVENTS
    // To be called when process is restarted or terminated
    gracefulShutdown = function(msg, callback) {
        mongoose.connection.close(function() {
            console.log('OBS ! Detta har hänt - Mongoose disconnected through ' + msg);
            callback();
        });
    };
    // For nodemon restarts
    process.once('SIGUSR2', function() {
        gracefulShutdown('nodemon restart', function() {
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    // For app termination
    process.on('SIGINT', function() {
        gracefulShutdown('app termination', function() {
            process.exit(0);
        });
    });
    // For Heroku app termination
    process.on('SIGTERM', function() {
        gracefulShutdown('Heroku app termination', function() {
            process.exit(0);
        });
    });
    // BRING IN YOUR SCHEMAS & MODELS
    connect();
    require('./priceentrys');
    require('./users');





    