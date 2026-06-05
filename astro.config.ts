import { createRequire } from 'node:module'

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import type { LanguageRegistration } from 'shiki'

import rehypeResponsiveImages from './src/plugins/rehype-responsive-images.ts'
import remarkAudio from './src/plugins/remark-audio.ts'

const require = createRequire(import.meta.url)
const lilypondGrammar = require('./src/syntaxes/lilypond.tmLanguage.json') as LanguageRegistration

export default defineConfig({
    site: 'https://pyonpyon.today',
    trailingSlash: 'never',
    output: 'static',
    integrations: [
        react(),
        sitemap({
            serialize(item) {
                // Extract post date from URL for lastmod
                // Post URLs: https://pyonpyon.today/p/YYYY-MM-<slug>
                const match = /\/p\/(\d{4})-(\d{2})-/.exec(item.url)
                if (match) {
                    // Use the year-month from the slug as an approximate lastmod
                    item.lastmod = new Date(`${match[1]}-${match[2]}-01`)
                }
                return item
            },
        }),
    ],
    markdown: {
        shikiConfig: {
            theme: 'github-light-default',
            langs: [{ ...lilypondGrammar, name: 'lilypond', aliases: ['ly'] }],
        },
        remarkPlugins: [remarkAudio],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeUnwrapImages, rehypeResponsiveImages],
    },
})
