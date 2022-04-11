
import { success, failure } from "./libs/response-lib";
import AWS from "./libs/aws_sdk";
import * as uuid from "uuid";

export async function getPreSignedUrl(event, context){
  const S3 = new AWS.S3();

  const params = {
    Bucket: process.env.uploadBucket,
    Key: uuid.v4(),
    Expires: 30,
  };

  try {
    const url = await S3.getSignedUrl('putObject', params);

    return success({"signedUrl":url, objectId: params.Key});
  } catch (error) {
      return failure(error);
  }
};