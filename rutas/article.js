'use strict'

const express = require('express')
var articleController= require('../controllers/article')
var router= express.Router()

//configurar multipart
var multipart= require('connect-multiparty')
var md_upload= multipart({uploadDir: './upload/articles'})

/* router.get('/test', articleController.testing()) */

router.post('/save', articleController.save)
router.get('/articles/:last?', articleController.getArticles)
router.get('/article/:id', articleController.getArticle)
router.put('/article/:id', articleController.update)
router.delete('/article/:id', articleController.delete)
router.post('/upload-image/:id?', md_upload, articleController.upload)
router.get('/get-image/:image', articleController.getImage)
router.get('/search/:search', articleController.search)
module.exports= router;