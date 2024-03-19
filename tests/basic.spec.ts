import { expect, test } from '@playwright/test'

test('works', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('logo')).toBeVisible()

    await page.getByTestId('navigation').getByText('Archive').click()
    await expect(page.getByTestId('postList')).toBeVisible()
})
