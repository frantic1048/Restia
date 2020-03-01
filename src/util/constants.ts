import { style, media } from 'typestyle'
import { rem } from 'csx'
import { NestedCSSProperties } from 'typestyle/lib/types'

const primaryRatio = 1.5
const secondaryRatio = 1.25 // For small screens
const smallScreenBreakPoint = 1200 // px

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
            media({ maxWidth: smallScreenBreakPoint }, { fontSize: rem(secondaryFactor) }),
            media({ minWidth: smallScreenBreakPoint + 1 }, { fontSize: rem(factor) }),
        ]
    }

    return scales[step]
}
