'use strict'

var validator= require('validator')
var Article=require('../models/article')
var fs= require('fs')
var path= require('path')

var controller={

 
save:(req, res)=>{
    //recoger parametros por POST
var params= req.body



    //validar datos con validator
try {
    var validate_title=!validator.isEmpty(params.title)
    var validate_content=!validator.isEmpty(params.content)
} catch (error) {
    return res.status(400).send({
        status:'error',
        message:'faltan datos por enviar'
    })
}
if (validate_title && validate_content) {
   //crear el objeto a guardar
var article= new Article();
    //asignar valores
article.title= params.title
article.content= params.content
if (!params.image|| params.image==null || params.image==undefined) {
    article.image=null
}else{
    article.image= params.image
}

    //guardar el articulo
article.save((err, articleStored)=>{
if (err || !articleStored) {
    res.status(404).send({
status:'error',
message:'los datos no se pudieron guardar'
    })
}else{
   //devolver response
   return res.status(200).send({
    status:'success',
    article: articleStored
})
}

})
 
} else {
    return res.status(200).send({
        status:"error",
        message:'los datos no son validos'
    })
}
    
},

getArticles: (req, res)=>{

    var query=Article.find({})
var last= req.params.last;
if (last || last!=undefined) {
    query.limit=5
}

   query.sort('-_id').exec((err, articles)=>{

if (err || !articles) {
    return res.status(404).send({
        status:"error",
        message:'no se encontraron articulos'
    })
} else {
    return res.status(200).send({
        status:"success",
        articles
    })
}

    })
   
},
getArticle:(req, res)=>{

//recoger id de URL
var articleId= req.params.id
//comporbar que exciste

if(articleId!=null &&  articleId!=undefined){
//buscar article 
Article.findById(articleId, (err, article)=>{
    if (err || !article) {
        return res.status(404).send({
            status:"error",
            message:'no se encontro el articulo'
        })
    } else {
        return res.status(200).send({
            status:"success",
            article
        })
    }
})
//devolverlo
}else{
    return res.status(200).send({
        status:"error",
        message:"no se ha solicitado ningun article"
    })
}
    
},
update:(req, res)=>{
//recoger id del articulo por url
var articleId= req.params.id

//recoger datos por put
var params=req.body
//validar los datos
try {
   var validate_title= !validator.isEmpty(params.title)
   var validate_content= !validator.isEmpty(params.content)

} catch (error) {
    return res.status(200).send({
        status:"error",
        message:"faltan datos por enviar"
    })
}

if (validate_title && validate_content) {
   //find and actualizar
Article.findOneAndUpdate({_id: articleId},params, {new:true},(err, articleUpdated) =>{

    if (err||!articleUpdated) {
        return res.status(500).send({
            status:"error",
            message:"No se pudo actualizar"
        })
    } else {
        return res.status(200).send({
            status:"success",
           article: articleUpdated
        })
    }
})
//devolver response 
}else{
    return res.status(200).send({
        status:"error",
        message:"los datos enviados son invalidos"
    })
}    
},
delete:(req, res)=>{
 
//recoger id de url
var articleId= req.params.id
//hacer find and delete

Article.findOneAndDelete({_id:articleId},(err, articleRemoved)=>{

    if(err){
        return res.status(500).send({
            status:"error",
            message:"Error al borrar el articulo"
        })  
    }

    if (!articleRemoved) {
        return res.status(200).send({
            status:"error",
            message:"no se encontro articulo a borrar"
        }) 
        
    }
    if (articleRemoved) {
        return res.status(200).send({
            status:"success",
            article:articleRemoved
        })        
    }
})
   
},
upload:(req, res)=>{
//configuar el modulo del connect multiparty(enrouter/article.js )--->DONE

//Recoger fichero de la peticion
var file_name= 'imagen no subida...'

if(!req.files){
    return res.status(404).send({
        status:'error',
        message:'No has enviado un archivo'
    })
}



//conseguir nombre y extension
var file_path=req.files.file0.path
var file_split= file_path.split('\\');
/* ADVERTENCIA EN SERVER LINUX O MAC('/') */

//nombre archivo
var file_name= file_split[2]

//extension de fichero
var extension_split=file_name.split('\.')
var file_ext= extension_split[1]



//comprobar extension, si no es valida borrar fichero
if(file_ext!= 'png' && file_ext!='jpg' && file_ext!= '.jpeg' && file_ext!='gif'){

    //bOrrar el archivo subido
fs.unlink(file_path,(err)=>{
    if (err) {
        return res.status(500).send({
            status:'error',
            message:'la extension de la imagen no es valida'
           
        })    
    }
})

    return res.status(200).send({
        status:'error',
        message:'formato de archivo invalido'
       
    })  
}else{
//sacar id de url
var articleId= req.params.id
if(articleId){

//si todo es valido buscar el article, asignar nombre y update
Article.findOneAndUpdate({_id: articleId},{image:file_name},{new:true}, (err, articleUpdated)=>{
if (err|| !articleUpdated) {
    return res.status(404).send({
        status:'error',
        message:'Error al guardar la imagen..',
      id: req.params.id
    }) 
}else{
    return res.status(200).send({
        status:'success',
        article: articleUpdated
       
    })   
}

})
}else{
    return res.status(200).send({
        status:'success',
        image: file_name
       
    })   
    

}

}  
},

getImage: (req, res)=>{
//sacar nombre de la img desde la url
var file= req.params.image
var path_file='./upload/articles/'+file

fs.exists(path_file, (exists)=>{
    if(exists){

return res.sendFile(path.resolve(path_file))

    }else{
        return res.status(404).send({
            status:'error',
            message:'imagen no encontrada o no existe'
           
           
        })   
    }
})   

},
search:(req, res)=>{

    //sacar el search desde la url
var searchString= req.params.search
    //find
Article.find({
    "$or":[
        {"title": {"$regex": searchString, "$options":"i"}},
        {"content": {"$regex": searchString, "$options":"i"}},
    ]
}).sort([['date', 'descending']])
.exec((err, articles)=>{

if (err||!articles|| articles.length<=0) {
    return res.status(404).send({
        status:'error',
        message:'No se encontro nada relacionado con la busqueda'      
       
    })  
} else {
    
    return res.status(200).send({
        status:'success',
       articles   
       
    })  
 
}

})

}

}

module.exports=controller;