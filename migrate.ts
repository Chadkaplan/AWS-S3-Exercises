require('dotenv').config()
import * as AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
const s3 = new AWS.S3();

let jsonToMigrate
const getParams = {
    Bucket: 'source-mock-json-object',
    Key: 'mock.JSON'
}

s3.getObject(getParams, function (err, data) {
    if (err) {
        return err
    }
    jsonToMigrate = data.Body.toString('utf-8');
    console.log(jsonToMigrate)
})

const BUCKET_NAME = 'target-mock-json-object'

const s3upload = new AWS.S3({
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
})

const uploadToS3 = async (data): Promise<string> => {
    const name = uuid() + '.JSON'
    await s3upload.putObject({
        Key: name,
        Bucket: BUCKET_NAME,
        ContentType: 'JSON',
        Body: data,
        ACL: 'public-read'
    }).promise();
    return name;
}

const main = async () => {
    try {
        const data = jsonToMigrate
        const url = await uploadToS3(data);
        console.log(url);
    } catch (err) {
        console.log(err);
    }
}

main();