
require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');

//Multer 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage })







//Aws
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})



const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3003;

app.get("/", async (req, res) => {
    res.send({ message: 'server Is running' })
})

app.post("/upload", upload.single('photo'), async (req, res) => {
    try {
        let myFile = req.file.originalname.split(".")
        const fileType = myFile[myFile.length - 1];
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}.${fileType}`,
            Body: req.file.encoding
        }
        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).send(error)
            }
            res.status(200).send(data)
        })
    }
    catch (err) {
        res.send({ sucess: true, message: err.message });
    }
})


app.listen(PORT, () => {
    console.log(`Server is Listening on port : ${PORT}`);
})