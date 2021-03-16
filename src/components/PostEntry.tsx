import { contentImageStyle } from '@util/constants'
import { rgba, em, rgb } from 'csx'
import { Link } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import * as React from 'react'
import { style } from 'typestyle'

const articleLinkClassName = style({
    display: 'block',
    margin: `${em(1)} 0`,
    background: 'none',
    textDecoration: 'none',
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
})

const postEntryClassName = style({
    background: rgb(250, 250, 250).toString(),
    $nest: {
        '& .gatsby-image-wrapper': {
            ...contentImageStyle,
        },
    },
})

const postInfoClassName = style({
    position: 'absolute',
    zIndex: 1,
    marginLeft: em(1),
    $nest: {
        '&>h1': {
            padding: `0 ${em(0.2)}`,
            marginBottom: 0,
            background: 'rgba(242, 242, 242, 0.79)',
            textDecoration: 'underline dotted',
        },
        '&>span': {
            background: 'rgba(242, 242, 242, 0.79)',
            padding: `0 ${em(0.4)}`,
        },
    },
})

const excerptClassName = style({
    margin: 0,
    paddingTop: em(8),
    paddingLeft: em(1),
    paddingBottom: em(1),
    color: rgb(70, 70, 70).toString(),
})

export interface PostEntryInfo {
    slug?: string | null
    title?: string | null
    date?: string | null
    excerpt?: string | null
    cover?: IGatsbyImageData
}

export default ({ slug, title, cover, excerpt, date }: PostEntryInfo) => (
    <Link to={slug ?? '#'} className={articleLinkClassName}>
        <article className={postEntryClassName}>
            <div className={postInfoClassName}>
                <h1>{title}</h1>
                <span>{date}</span>
            </div>
            {cover ? <GatsbyImage image={cover} alt={title ?? ''} /> : <p className={excerptClassName}>{excerpt}</p>}
        </article>
    </Link>
)
