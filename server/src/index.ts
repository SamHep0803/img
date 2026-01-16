import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { imageApi } from "./routes/image";

const app = new Hono();

app.use(cors());

app.route("/image", imageApi);

if (process.env.NODE_ENV !== "production") {
	app.use(
		"/api/auth/*", // or replace with "*" to enable cors for all routes
		cors({
			origin: "http://localhost:5173", // replace with your origin
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "OPTIONS"],
			exposeHeaders: ["Content-Length"],
			maxAge: 600,
			credentials: true,
		}),
	);
}
app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.use("*", serveStatic({ root: "./static" }));
app.get("*", async (c, next) => {
	return serveStatic({ root: "./static", path: "index.html" })(c, next);
});

export default app;
