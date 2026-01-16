import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
	trustedOrigins: ["http://localhost:5173"],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: "sml",
					clientId: "b6337b38-3f05-46e1-8e65-c792dd7af9fb",
					clientSecret: "2TWKEOFPqwHfgRHEP89PSOxhJF9luzm2",
					discoveryUrl: "https://auth.sml.wtf/.well-known/openid-configuration",
					scopes: ["openid email profile"],
				},
			],
		}),
	],
});
