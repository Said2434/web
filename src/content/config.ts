import { defineCollection, z } from "astro:content";
import { gitHubReposLoader } from "../loaders/repos";
import { gitHubContributionsLoader } from "../loaders/contributions";
import { glob } from "astro/loaders";

// Access the GitHub token from the environment
const GH_TOKEN = import.meta.env.GH_TOKEN;

// Safely assert GH_TOKEN as a string
const token = GH_TOKEN as unknown as string;

// Ensure the token is valid
if (!token) {
  throw new Error("GitHub token (GH_TOKEN) is missing or invalid!");
}

// Define the blog collection
const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/blog",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60).min(10),
      hero: z.preprocess((val) => `~/assets/heros/${val}`, image()),
      heroAlt: z.string(),
      description: z.string().max(160).min(110),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
    }),
});

// Define the projects collection
const projects = defineCollection({
  loader: gitHubReposLoader({
    username: "said2434",
  }),
});

// Define the contributions collection
const contributions = defineCollection({
  loader: gitHubContributionsLoader({
    token: token, // Use the safely asserted token
  }),
});

export const collections = {
  blog,
  projects,
  contributions,
};
