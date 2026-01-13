import { S3Client } from "@aws-sdk/client-s3";

export const client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.S3_ENDPOINT ?? "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});
