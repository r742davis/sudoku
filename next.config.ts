import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo-name>, so every URL needs that prefix.
// The deploy workflow sets PAGES_BASE_PATH; locally it's unset and the app runs at /.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
	// Write the site to ./out as plain HTML, CSS and JS. GitHub Pages can't run a Node server.
	output: "export",
	basePath,
	// /learn/x-wing becomes /learn/x-wing/index.html, which Pages serves without extra rules.
	trailingSlash: true,
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

export default nextConfig;
