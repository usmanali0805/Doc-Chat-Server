function GetAllDocument (req ,res){
 const {documentId , userId , content , embedding , pageNumber , ChunkIndex } = req.body
    
}

function UploadDocument(req , res){
    return res.status(200).json({
        data: req.file
    })
}

function GetSingleDocument(req , res){

}

function GetDocumentStatus(req , res){

}

function DeleteDocument(req , res){

}


export {GetAllDocument , UploadDocument , GetDocumentStatus , GetSingleDocument , DeleteDocument}