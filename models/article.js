'use strict'

const mongoose  = require("mongoose")
var Schema= mongoose.Schema

const articleSchema= Schema({
title:String,
content:String,
date:{ type:Date, default: Date.now},
image:String


})

module.exports= mongoose.model('Article', articleSchema); //mongoose crea collection en plural