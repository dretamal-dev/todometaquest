import { defineCollection, z } from "astro:content";

const guias = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    author: z.string(),
    // img: z.string().url(),
    img: z.string(),
    readtime: z.number(),
    description: z.string(),
    home: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    related_images: z.array(z.string()).optional(),
  })
});

const juegos = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    author: z.string(),
    // img: z.string().url(),
    img: z.string(),
    readtime: z.number(),
    description: z.string(),
    home: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
});

const accesorios = defineCollection({
  schema: z.object({
    date: z.date(),
    title: z.string(),
    author: z.string(),
    // img: z.string().url(),
    img: z.string().optional(),
    modelo: z.string(),
    readtime: z.number(),
    description: z.string(),
    caption: z.string(),
    home: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
});

const experiencias = defineCollection({
  schema: z.object({
    title: z.string(),
    img: z.string().optional(),
    videos: z.array(z.string()).optional()
  })
});

export const collections = { 'guias': guias, 'juegos': juegos, 'accesorios': accesorios, 'experiencias': experiencias };