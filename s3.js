const S3 = require("aws-sdk/clients/s3");
const fs = require('fs');
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// uploads a file to s3
function uploadFile(file, mimetype, filePath, fileName) {
    const fileStream = fs.createReadStream(filePath)
    return s3.putObject({
        Bucket: bucketName,
        Body: fileStream,
        Key: fileName,
        ContentType: mimetype,
        ContentLength: file['size']
    }).promise();
}
exports.uploadFile = uploadFile


// downloads a file from s3
// function getFileStream(fileKey) {
//     const downloadParams = {
//         Key: fileKey,
//         Bucket: bucketName
//     }

//     return s3.getObject(downloadParams).createReadStream()
// }

// exports.getFileStream = getFileStream



// bucket name: highway-app-images-bucket