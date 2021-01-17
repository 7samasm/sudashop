const aws = require("aws-sdk");
const fs = require("fs");
const  {getEnvironmentVariable}  = require('./helpers')

const uploadFile = async ({ fileName, filePath, fileType }) => {
  return new Promise((resolve, reject) => {
    aws.config.update({
      // You'll need your service's access keys here
      accessKeyId: getEnvironmentVariable('CELLAR_ADDON_KEY_ID'),
      secretAccessKey: getEnvironmentVariable('CELLAR_ADDON_KEY_SECRET'),
    });

    const s3 = new aws.S3({
      // If you want to specify a different endpoint, such as using DigitalOcean spaces
      // endpoint: new aws.Endpoint("nyc3.digitaloceanspaces.com"),
      endpoint: getEnvironmentVariable('CELLAR_ADDON_HOST'),
      
    });

    const stream = fs.createReadStream(filePath);
    stream.on("error", function(err) {
      reject(err);
    });

    s3.upload(
      {
        ACL: "public-read",
        // You'll input your bucket name here
        Bucket: "main-content",
        Body: stream,
        Key: fileName,
        ContentType: fileType,
      },
      function(err, data) {
        if (err) {
          reject(err);
        } else if (data) {
          resolve({ key: data.Key, url: data.Location });
        }
      }
    );
  });
};

module.exports = { uploadFile };