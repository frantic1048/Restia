import {
    baseFontSize,
    contentImageStyle,
    hiresMedia,
    hiresMediaLayoutSideMargin,
    largeMedia,
    largeMediaLayoutSideMargin,
    largeScreenBreakPoint,
    scaleAt,
    smallMedia,
    smallScreenBreakPoint,
} from '@util/constants'
import { rgba, em, rgb, px, percent, scale } from 'csx'
import { Link } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import * as React from 'react'
import stringWidth from 'string-width'
import { classes, style } from 'typestyle'

const articleBorderWidth = 16
const articleLinkClassName = style(
    {
        display: 'block',
        background: 'none',
        textDecoration: 'none',
        margin: px(articleBorderWidth),
        padding: 0,
        $nest: {
            '&:hover': {
                background: 'none',
                $nest: {
                    '& span, & h1': {
                        color: 'white',
                        background: rgba(0, 149, 255, 0.5).toString(),
                    },
                    '& h1': {
                        textDecorationStyle: 'solid',
                    },
                },
            },
        },
    },
    smallMedia({
        marginLeft: 0,
        marginRight: 0,
    }),
)

const postEntryClassName = style(
    {
        display: 'grid',
        height: percent(100),
        background: rgb(250, 250, 250).toString(),
        boxShadow: `${px(1)} ${px(1)} ${px(3)} #aaa`,
    },
    smallMedia({
        padding: em(0.5),
    }),
)

const postEntrySidePadding = 1 * baseFontSize

const postInfoClassName = style(
    {
        position: 'absolute',
        zIndex: 1,
        marginLeft: px(postEntrySidePadding),
        $nest: {
            '&>h1': {
                padding: `0 ${em(0.2)}`,
                marginBottom: 0,
                textDecoration: 'underline dotted',
                ...Object.assign({}, ...scaleAt(1)),
            },
            '&>span': {
                padding: `0 ${em(0.4)}`,
            },
            '&>h1, &>span': {
                background: 'rgba(242, 242, 242, 0.79)',
            },
        },
    },
    smallMedia({
        position: 'static',
        marginLeft: 0,
        $nest: {
            '&>h1': {
                ...Object.assign({}, ...scaleAt(0)),
                background: 0,
            },
            '&>h1, &>span': {
                background: 0,
            },
        },
    }),
)

const excerptClassName = style(
    {
        margin: 0,
        paddingTop: em(8),
        paddingLeft: px(postEntrySidePadding),
        paddingRight: px(postEntrySidePadding),
        paddingBottom: em(1),
        color: rgb(70, 70, 70).toString(),
    },
    smallMedia({
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
    }),
)

/**
 * some layout stuff ╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ
 */
const smallMediaColumnCount = 1
const largeMediaColumnCount = 2
/**
 * FIXME: 3 columns wanted q_q
 *
 * need better measuring for post entry without cover image
 * or 3 column will be bad, on page contains post entry without cover image
 *
 * see {@link generateGridRowClassName}
 */
const hiresMediaColumnCount = 3

const minLargeMediaWidth = smallScreenBreakPoint + 1
const minHiresMediaWidth = largeScreenBreakPoint + 1

const minSingleColumnWidthOnLargeMedia =
    (minLargeMediaWidth - 2 * largeMediaLayoutSideMargin - largeMediaColumnCount * 2 * articleBorderWidth) /
    largeMediaColumnCount
const minSingleColumnContentWidthOnLargeMedia = minSingleColumnWidthOnLargeMedia - 2 * postEntrySidePadding

const minSingleColumnWidthOnHiresMedia =
    (minHiresMediaWidth - 2 * hiresMediaLayoutSideMargin - hiresMediaColumnCount * 2 * articleBorderWidth) /
    hiresMediaColumnCount
const minSingleColumnContentWidthOnHiresMedia = minSingleColumnWidthOnHiresMedia - 2 * postEntrySidePadding

/**
 * rough estimate...
 *
 * FIXME:
 *
 * plan A: consider real text measuring, like node-canvas for more (still not 100%) accurate measuring.
 * plan B: assign cover image(with fixed aspect ratio) for EVERY post, then we can get 100% accurate aspect ratio (°Д°).
 * plan C(current): fixed aspect ratio for every grid row, simple, and not bad ...
 */
const measureTitleWidth = (text: string) => stringWidth(text) * 24 * 0.5

interface GenerateGridRowClassNameProps {
    cover?: IGatsbyImageData
    title?: string
    excerpt?: string
}
const generateGridItemClassName = ({ cover, title = '', excerpt = '1' }: GenerateGridRowClassNameProps) => {
    const columnSpanOnSmallMedia = smallMediaColumnCount
    const columnSpanOnLargeMedia = measureTitleWidth(title) > minSingleColumnContentWidthOnLargeMedia ? 2 : 1
    const columnSpanOnHiresMedia = measureTitleWidth(title) > minSingleColumnContentWidthOnHiresMedia ? 2 : 1

    /**
     * MEMO:
     *
     * basically, gridRow span = height basis = Math.ceil(height / width * 100)
     *
     * TODO: add responsive lengths into calculation && measuring
     */
    return style(
        /**
         * gridRow, specifies relative height of grid item
         * defined as Math.ceil(( width / height ) * 100)
         *
         * - Math.ceil() for positive integer, as CSS gridRow needs
         * - (* 100) for more precision.
         *      With larger multiplier,
         *      we get larger dynamics of grid item height,
         *      the higher accurancy of representing different relative height of grid items.
         */
        /**
         * post with cover
         *
         * if post with cover image spans across 2 columns,
         * it will be "scaled", thus height go with 2×
         */
        cover &&
            largeMedia({
                $nest: {
                    '&:first-child': { gridRow: 'span 2', gridColumn: 'span 2' },
                    '&:not(:first-child)': {
                        gridRow: `span ${columnSpanOnLargeMedia}`,
                        gridColumn: `span ${columnSpanOnLargeMedia}`,
                    },
                },
            }),
        cover &&
            hiresMedia({
                $nest: {
                    '&:first-child': { gridRow: 'span 2', gridColumn: 'span 2' },
                    '&:not(:first-child)': {
                        gridRow: `span ${columnSpanOnHiresMedia}`,
                        gridColumn: `span ${columnSpanOnHiresMedia}`,
                    },
                },
            }),

        /**
         * post without cover
         *
         * assume 16px font size, plus 144px padding
         */
        !cover && {
            display: 'flex',
            alignItems: 'stretch',
            $nest: {
                '&>article': { flexGrow: 1 },
            },
        },
        !cover && largeMedia({ gridColumn: `span ${columnSpanOnLargeMedia}` }),
        !cover && hiresMedia({ gridColumn: `span ${columnSpanOnHiresMedia}` }),

        smallMedia({ gridColumn: `span ${columnSpanOnSmallMedia}` }),
    )
}

export interface PostEntryInfo {
    slug?: string | null
    title?: string | null
    date?: string | null
    excerpt?: string | null
    cover?: IGatsbyImageData
}

export default ({ slug, title, cover, excerpt, date }: PostEntryInfo) => (
    <Link
        to={slug ?? '#'}
        className={classes(
            articleLinkClassName,
            generateGridItemClassName({
                cover: cover ?? undefined,
                title: title ?? undefined,
                excerpt: excerpt ?? undefined,
            }),
        )}
    >
        <article className={postEntryClassName}>
            <div className={postInfoClassName}>
                <h1>{title}</h1>
                <span>{date}</span>
            </div>
            {cover ? <GatsbyImage image={cover} alt={title ?? ''} /> : <p className={excerptClassName}>{excerpt}</p>}
        </article>
    </Link>
)
