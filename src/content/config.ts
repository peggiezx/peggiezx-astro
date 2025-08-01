import { defineCollection, z } from "astro:content";

export const collections = {
  blog: defineCollection({
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
  }),
  projects: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      stack: z.array(z.string()),
      github: z.string().optional(),
      demo: z.string().optional(),
      featured: z.boolean().optional(),
    }),
  }),
};
