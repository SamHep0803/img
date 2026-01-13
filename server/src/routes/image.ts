import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { client } from "../client";

export const imageApi = new Hono();

imageApi.get("/", (c) => {
  return c.text("Hello Hono!");
});

// biome-ignore lint/suspicious/noUselessEscapeInString: false positive
imageApi.get("/:image{.+\.(png|jpg)}", async (c) => {
  const imagePath = c.req.param("image");

  const command = new GetObjectCommand({
    Bucket: "img",
    Key: imagePath,
  });
  const image = await client.send(command);
  const byteArray = await image.Body?.transformToByteArray();
  if (!byteArray) {
    return c.json({
      message: "file does not exist",
    });
  }

  return stream(c, async (stream) => {
    stream.onAbort(() => {
      console.log("Aborted!");
    });
    await stream.write(byteArray);
  });
});

imageApi.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const imageUpload = body.image;

  if (!imageUpload) {
    return c.json({
      message: "file not provided",
    });
  }

  if (!(imageUpload instanceof File)) {
    return c.json({
      message: "invalid file",
    });
  }

  const filename = c.req.query("filename");
  if (!filename) {
    return c.json({
      message: "file name not provided",
    });
  }

  const buffer = Buffer.from(await imageUpload.arrayBuffer());

  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const fullPath = `${year}/${month}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: "img",
    Key: fullPath,
    Body: buffer,
    ContentType: imageUpload.type,
  });
  await client.send(command);

  return c.json({
    image: `http://localhost:3000/image/${fullPath}`,
  });
});
