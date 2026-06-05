import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import sharp from 'sharp'

export interface PublicImageData {
    hash: string
    originalSrc: string
    width: number
    height: number
    displayWidth: number
    sizes: number[]
    jpegSrcSet: string
    webpSrcSet: string
    fallbackSrc: string
    lqipDataUrl: string
}

interface PublicImageOptions {
    maxWidth?: number
}

const defaultMaxWidth = 1200
const breakpoints = [300, 600, 800, 1200, 1800]
const jpegQuality = 90
const webpQuality = 93
const lqipWidth = 20
const lqipQuality = 20
const pipelineCacheVersion = 'v1'
const cacheDir = resolve('.cache/restia-images', pipelineCacheVersion)
const outputDir = resolve('public/_img')
const distDir = resolve('dist')
const distOutputDir = resolve(distDir, '_img')
const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff'])
const publicImageDataCache = new Map<string, PublicImageData>()
type OutputFormat = 'jpg' | 'webp'

rmSync(outputDir, { recursive: true, force: true })

function isLocalRasterImage(src: string): boolean {
    if (!src.startsWith('/') || src.startsWith('//')) return false
    const ext = src.slice(src.lastIndexOf('.')).toLowerCase()
    return rasterExtensions.has(ext)
}

function fingerprintImage(src: string, sourceBuffer: Buffer, maxWidth: number): string {
    return createHash('sha256')
        .update(pipelineCacheVersion)
        .update(src)
        .update(sourceBuffer)
        .update(
            JSON.stringify({
                breakpoints,
                jpegQuality,
                lqipQuality,
                lqipWidth,
                maxWidth,
                webpQuality,
            }),
        )
        .digest('hex')
        .slice(0, 16)
}

function getCacheKey(src: string, fingerprint: string): string {
    return `${src}:${fingerprint}`
}

function getOutputSrc(hash: string, width: number, format: OutputFormat): string {
    return `/_img/${hash}/${width}.${format}`
}

function getImagePath(directory: string, width: number, format: OutputFormat): string {
    return resolve(directory, `${width}.${format}`)
}

function getLqipPath(directory: string): string {
    return resolve(directory, 'lqip.txt')
}

async function materializeOutputImage(
    sourceBuffer: Buffer,
    cacheOutDir: string,
    outputDirectories: string[],
    width: number,
    format: OutputFormat,
): Promise<void> {
    const cachedPath = getImagePath(cacheOutDir, width, format)

    if (!existsSync(cachedPath)) {
        const pipeline = sharp(sourceBuffer).resize(width)
        if (format === 'jpg') {
            await pipeline.jpeg({ quality: jpegQuality }).toFile(cachedPath)
        } else {
            await pipeline.webp({ quality: webpQuality }).toFile(cachedPath)
        }
    }

    for (const outputDirectory of outputDirectories) {
        const outputPath = getImagePath(outputDirectory, width, format)
        if (!existsSync(outputPath)) {
            copyFileSync(cachedPath, outputPath)
        }
    }
}

async function getLqipDataUrl(sourceBuffer: Buffer, cacheOutDir: string): Promise<string> {
    const cachedPath = getLqipPath(cacheOutDir)
    if (existsSync(cachedPath)) return readFileSync(cachedPath, 'utf8')

    const lqipBuffer = await sharp(sourceBuffer).resize(lqipWidth).jpeg({ quality: lqipQuality }).toBuffer()
    const lqipDataUrl = `data:image/jpeg;base64,${lqipBuffer.toString('base64')}`
    writeFileSync(cachedPath, lqipDataUrl)
    return lqipDataUrl
}

export function getResponsiveImageSizes(data: PublicImageData): string {
    return `(max-width: ${data.displayWidth}px) 100vw, ${data.displayWidth}px`
}

export function getResponsiveImageAspectRatio(data: PublicImageData): string {
    return `${(data.height / data.width) * 100}%`
}

export async function processPublicImage(
    src: string | undefined,
    { maxWidth = defaultMaxWidth }: PublicImageOptions = {},
): Promise<PublicImageData | undefined> {
    if (!src || !isLocalRasterImage(src)) return undefined

    const filePath = resolve('public', src.slice(1))
    if (!existsSync(filePath)) return undefined

    const sourceBuffer = readFileSync(filePath)
    const hash = fingerprintImage(src, sourceBuffer, maxWidth)
    const cacheKey = getCacheKey(src, hash)
    const cached = publicImageDataCache.get(cacheKey)
    if (cached) return cached

    const metadata = await sharp(sourceBuffer).metadata()
    if (!metadata.width || !metadata.height) return undefined

    const displayWidth = Math.min(metadata.width, maxWidth)
    const cacheOutDir = resolve(cacheDir, hash)
    const outputDirectories = [resolve(outputDir, hash)]
    if (existsSync(distDir)) outputDirectories.push(resolve(distOutputDir, hash))

    mkdirSync(cacheOutDir, { recursive: true })
    for (const outputDirectory of outputDirectories) {
        mkdirSync(outputDirectory, { recursive: true })
    }

    const sizes = breakpoints.filter((width) => width < metadata.width)
    if (!sizes.includes(displayWidth)) sizes.push(displayWidth)
    if (!sizes.includes(metadata.width)) sizes.push(metadata.width)
    sizes.sort((a, b) => a - b)

    for (const width of sizes) {
        await materializeOutputImage(sourceBuffer, cacheOutDir, outputDirectories, width, 'jpg')
        await materializeOutputImage(sourceBuffer, cacheOutDir, outputDirectories, width, 'webp')
    }

    const lqipDataUrl = await getLqipDataUrl(sourceBuffer, cacheOutDir)
    const fallbackWidth = sizes.filter((width) => width <= displayWidth).at(-1) ?? displayWidth
    const data = {
        hash,
        originalSrc: src,
        width: metadata.width,
        height: metadata.height,
        displayWidth,
        sizes,
        jpegSrcSet: sizes.map((width) => `${getOutputSrc(hash, width, 'jpg')} ${width}w`).join(', '),
        webpSrcSet: sizes.map((width) => `${getOutputSrc(hash, width, 'webp')} ${width}w`).join(', '),
        fallbackSrc: getOutputSrc(hash, fallbackWidth, 'jpg'),
        lqipDataUrl,
    }

    publicImageDataCache.set(cacheKey, data)
    return data
}
