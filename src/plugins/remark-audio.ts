import { visit } from 'unist-util-visit'

/**
 * Remark plugin to transform inline code audio references into <audio> elements.
 *
 * Port of gatsby-remark-audio. Matches inline code like `audio: /path/to/file.m4a`
 * and replaces with an HTML audio element.
 */
export default function remarkAudio() {
    return (tree: Parameters<typeof visit>[0]) => {
        visit(tree, 'inlineCode', (node: { type: string; value: string }) => {
            const matches = /^audio:\s*(.+)$/.exec(node.value)
            if (matches) {
                const url = matches[1].trim()
                node.type = 'html'
                node.value = `<audio src="${url}" preload="auto" controls></audio>`
            }
        })
    }
}
