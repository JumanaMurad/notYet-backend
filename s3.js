require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


// Uploads a file to s3
exports.upload = (file) => {
    const fileStream = fs.createReadStream(`./img/${file.filename}`)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();
}

// downloads a file from s3
exports.getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}


// Removes a file from s3
exports.removeFile = (fileKey) => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    };

    return s3.deleteObject(deleteParams).promise();
};



exports.uploadDrawingData = (base64ImageData) => {
    const drawingDataBuffer = Buffer.from(base64ImageData, 'base64');
    const drawingDataKey = 'drawing_data.png'; // Set a desired key for the drawing data file
  
    const uploadParams = {
      Bucket: bucketName,
      Body: drawingDataBuffer,
      Key: drawingDataKey
    };
  
    return s3.upload(uploadParams).promise();
  };
  
  exports.getDrawingData = () => {
    const drawingDataKey = 'drawing_data.png'; // Set the key for the drawing data file
  
    const downloadParams = {
      Key: drawingDataKey,
      Bucket: bucketName
    };
  
    return s3.getObject(downloadParams).promise()
      .then((data) => data.Body);
  };
