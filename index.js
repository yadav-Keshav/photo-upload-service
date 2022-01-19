
require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');


//Multer 
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})
const upload = multer({ storage: storage }).single('image');



//Aws
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})



const app = express();
const PORT = process.env.PORT || 3003;

app.get("/", async (req, res) => {
    res.send({ message: 'server Is running' })
})

app.post("/upload", upload, async (req, res) => {
    try {
        let myFile = req.file.originalname.split(".")
        const fileType = myFile[myFile.length - 1];
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}.${fileType}`,
            Body: req.file.buffer
        }
        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).send(error)
            }
            res.status(200).send(data)
        })
    }
    catch (err) {
         res.send({sucess:true,message:err.message});
    }
})


app.listen(PORT, () => {
    console.log(`Server is Listening on port : ${PORT}`);
})