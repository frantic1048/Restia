import { toString } from 'mdast-util-to-string'
import remarkParse from 'remark-parse'
import stripMarkdown from 'strip-markdown'
import { unified } from 'unified'

const htmlEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
}

const decodeHtmlEntities = (text: string) =>
    text.replace(/&(#\d+|#x[\da-f]+|\w+);/gi, (entity, value: string) => {
        if (value.startsWith('#x')) {
            return String.fromCodePoint(Number.parseInt(value.slice(2), 16))
        }

        if (value.startsWith('#')) {
            return String.fromCodePoint(Number.parseInt(value.slice(1), 10))
        }

        return htmlEntities[value] ?? entity
    })

const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
const markdownProcessor = unified()
    .use(remarkParse)
    .use(stripMarkdown, {
        remove: ['image', 'imageReference'],
    })

export const truncatePlainText = (text: string, maxLength: number) => {
    let length = 0
    let truncated = ''

    for (const { segment } of graphemeSegmenter.segment(text)) {
        if (length >= maxLength) {
            break
        }

        truncated += segment
        length += 1
    }

    return truncated
}

const normalizePlainText = (text: string) => decodeHtmlEntities(text.replace(/\s+/g, ' ').trim())

export const markdownToPlainText = async (markdown: string) => {
    const tree = markdownProcessor.parse(markdown)
    const strippedTree = await markdownProcessor.run(tree)

    return normalizePlainText(toString(strippedTree))
}

export const excerptFromMarkdown = async (markdown: string, maxLength = 80) =>
    truncatePlainText(await markdownToPlainText(markdown), maxLength)
