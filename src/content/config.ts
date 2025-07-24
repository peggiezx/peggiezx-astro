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
};
