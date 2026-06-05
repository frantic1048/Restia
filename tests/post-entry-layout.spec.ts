import { expect, type Page, test } from '@playwright/test'

interface PostEntryRect {
    title: string | null
    x: number
    y: number
    width: number
    height: number
}

async function getPostEntryRects(page: Page): Promise<PostEntryRect[]> {
    return page.locator('.article-link').evaluateAll((elements) =>
        elements.slice(0, 9).map((element) => {
            const rect = element.getBoundingClientRect()

            return {
                title: element.querySelector('h1')?.textContent ?? null,
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            }
        }),
    )
}

function getMaxDelta(before: PostEntryRect[], after: PostEntryRect[]): number {
    return Math.max(
        ...before.flatMap((entry, index) => {
            const nextEntry = after[index]

            return [
                Math.abs(nextEntry.x - entry.x),
                Math.abs(nextEntry.y - entry.y),
                Math.abs(nextEntry.width - entry.width),
                Math.abs(nextEntry.height - entry.height),
            ]
        }),
    )
}

test('homepage post entries keep their positions while cover images load', async ({ page }) => {
    let releaseImages: () => void = () => {}
    const imagesReleased = new Promise<void>((resolve) => {
        releaseImages = resolve
    })

    await page.route('**/*', async (route) => {
        const url = new URL(route.request().url())

        if (route.request().resourceType() === 'image' && url.pathname.startsWith('/photo/')) {
            await imagesReleased
        }

        await route.continue()
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('postList')).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    const before = await getPostEntryRects(page)

    releaseImages()
    await page.waitForLoadState('networkidle')

    const after = await getPostEntryRects(page)

    expect(getMaxDelta(before, after)).toBeLessThanOrEqual(2)
})
