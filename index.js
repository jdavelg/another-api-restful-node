'use strict'


var mongoose= require('mongoose')
var app= require('./app')
var port= 3900

mongoose.Promise=global.Promise;
mongoose.set('useNewUrlParser', true );
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/api_rest_blog',{useNewUrlParser:true, useUnifiedTopology: true})
    .then(()=>{

        console.log("connection succesfully");
        
        //Creacion del servidor

        app.listen(process.env.PORT || 8080
    
)
console.log('server running');
    })
    .catch(err=> console.log(err))

/* 'mongodb://localhost:27017/api_rest_blog',{useNewUrlParser:true, useUnifiedTopology: true} */