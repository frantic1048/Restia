import { media } from 'typestyle'
import { rem, px } from 'csx'
import { NestedCSSProperties } from 'typestyle/lib/types'

export const baseFontSize = 16
const primaryRatio = 1.5
const secondaryRatio = 1.25 // For small screens
export const smallScreenBreakPoint = 1070 // px
export const largeScreenBreakPoint = 1430 // px

export const smallMedia = (style: NestedCSSProperties) => media({ maxWidth: smallScreenBreakPoint }, style)
export const largeMedia = (style: NestedCSSProperties) =>
    media({ minWidth: smallScreenBreakPoint + 1, maxWidth: largeScreenBreakPoint }, style)
export const hiresMedia = (style: NestedCSSProperties) => media({ minWidth: largeScreenBreakPoint + 1 }, style)

export const largeMediaLayoutSideMargin = 4 * baseFontSize
export const hiresMediaLayoutSideMargin = 6 * baseFontSize

// Dumb table
const scales: { [key: number]: NestedCSSProperties[] } = {}
/**
 * returns css propersties list for a scale step
 * maintains fontSize
 */
export const scaleAt = (step: number) => {
    if (!scales[step]) {
        const factor = 1 * primaryRatio ** step
        const secondaryFactor = 1 * secondaryRatio ** step
        scales[step] = [
            { fontSize: rem(factor) },
            smallMedia({ fontSize: rem(secondaryFactor) }),
            largeMedia({ fontSize: rem(factor) }),
            hiresMedia({ fontSize: rem(factor) }),
        ]
    }

    return scales[step]
}

/**
 * add a simple shadow to images
 */
export const contentImageStyle: NestedCSSProperties = {
    boxShadow: `${px(1)} ${px(1)} ${px(3)} #aaa`,
}
