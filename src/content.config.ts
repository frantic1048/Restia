import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/posts',
        generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        update: z.coerce.date().optional(),
        tags: z.array(z.string()).optional().default([]),
        category: z.string().optional(),
        cover: z.string().optional(),
    }),
})

export const collections = { posts }
