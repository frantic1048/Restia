import type { Element, Root } from 'hast'
import { visit } from 'unist-util-visit'

import {
    getResponsiveImageAspectRatio,
    getResponsiveImageSizes,
    processPublicImage,
    type PublicImageData,
} from '../util/images.ts'

const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff'])

function isLocalRasterImage(src: string): boolean {
    if (!src.startsWith('/') || src.startsWith('//')) return false
    const ext = src.slice(src.lastIndexOf('.')).toLowerCase()
    return rasterExtensions.has(ext)
}

function buildResponsiveElement(img: PublicImageData, alt: string): Element {
    // Build hast tree matching the Astro ResponsiveImage component:
    // <span class="responsive-image resp-image-wrapper" style="...">
    //   <a href="original" style="display: block" target="_blank" rel="noopener">
    //     <span class="responsive-image-frame">
    //       <span class="responsive-image-placeholder" style="...LQIP..."></span>
    //       <source srcset="...webp..." type="image/webp" />
    //       <source srcset="...jpeg..." type="image/jpeg" />
    //       <picture><img src="fallback.jpg" alt="..." loading="lazy" decoding="async" /></picture>
    //     </span>
    //   </a>
    // </span>
    const sizes = getResponsiveImageSizes(img)

    const imgElement: Element = {
        type: 'element',
        tagName: 'img',
        properties: {
            className: ['responsive-image-img'],
            src: img.fallbackSrc,
            alt,
            width: img.width,
            height: img.height,
            loading: 'lazy',
            decoding: 'async',
            dataResponsiveImage: true,
            dataObjectFit: 'contain',
        },
        children: [],
    }

    const webpSource: Element = {
        type: 'element',
        tagName: 'source',
        properties: { srcSet: img.webpSrcSet, sizes, type: 'image/webp' },
        children: [],
    }

    const jpegSource: Element = {
        type: 'element',
        tagName: 'source',
        properties: { srcSet: img.jpegSrcSet, sizes, type: 'image/jpeg' },
        children: [],
    }

    const picture: Element = {
        type: 'element',
        tagName: 'picture',
        properties: {
            className: ['responsive-image-picture'],
        },
        children: [webpSource, jpegSource, imgElement],
    }

    const placeholder: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
            className: ['responsive-image-placeholder'],
            style: `background-image: url('${img.lqipDataUrl}');`,
            ariaHidden: 'true',
        },
        children: [],
    }

    const frame: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
            className: ['responsive-image-frame'],
        },
        children: [placeholder, picture],
    }

    const link: Element = {
        type: 'element',
        tagName: 'a',
        properties: {
            className: ['responsive-image-link'],
            href: img.originalSrc,
            style: 'display: block',
            target: '_blank',
            rel: 'noopener',
        },
        children: [frame],
    }

    const wrapper: Element = {
        type: 'element',
        tagName: 'span',
        properties: {
            className: ['responsive-image', 'resp-image-wrapper'],
            style: `--responsive-image-max-width: ${img.displayWidth}px; --responsive-image-aspect-ratio: ${getResponsiveImageAspectRatio(img)}; --responsive-image-aspect: ${img.width} / ${img.height};`,
        },
        children: [link],
    }

    return wrapper
}

export default function rehypeResponsiveImages() {
    return async (tree: Root) => {
        const replacements: { parent: Element; index: number; replacement: Element }[] = []

        visit(tree, 'element', (node: Element, index, parent) => {
            if (
                node.tagName === 'img' &&
                typeof node.properties?.src === 'string' &&
                isLocalRasterImage(node.properties.src) &&
                parent &&
                typeof index === 'number'
            ) {
                replacements.push({ parent: parent as Element, index, replacement: node })
            }
        })

        for (const { parent, index, replacement: imgNode } of replacements) {
            const src = imgNode.properties.src as string
            const alt = (imgNode.properties.alt as string) ?? ''

            const processed = await processPublicImage(src)
            if (!processed) continue

            const responsiveElement = buildResponsiveElement(processed, alt)
            parent.children[index] = responsiveElement
        }
    }
}
