import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { imageApi } from "./routes/image";

const app = new Hono();

app.use(cors());

app.route("/image", imageApi);

app.use("*", serveStatic({ root: "./static" }));
app.get("*", async (c, next) => {
  return serveStatic({ root: "./static", path: "index.html" })(c, next);
});

export default app;
