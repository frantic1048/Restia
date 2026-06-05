import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { getCollection, render } from 'astro:content'

import { excerptFromMarkdown } from '../util/plain-text.ts'

export async function GET(context: APIContext) {
    const allPosts = await getCollection('posts')
    const sorted = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, 16)
    const container = await AstroContainer.create()

    const items = await Promise.all(
        sorted.map(async (post) => {
            const { Content, remarkPluginFrontmatter } = await render(post)
            void remarkPluginFrontmatter

            const content = await container.renderToString(Content)
            const postUrl = new URL(`/p/${post.id}/`, context.site).href

            return {
                title: post.data.title,
                pubDate: post.data.date,
                description: await excerptFromMarkdown(post.body ?? ''),
                link: `/p/${post.id}`,
                content,
                customData: [
                    `<guid isPermaLink="false">${postUrl}</guid>`,
                    post.data.update ? `<lastBuildDate>${post.data.update.toISOString()}</lastBuildDate>` : undefined,
                ]
                    .filter(Boolean)
                    .join(''),
            }
        }),
    )

    return rss({
        title: "Pyon Pyon Today's RSS Feed",
        description: 'Pyon Pyon Today',
        site: context.site!,
        items,
    })
}
