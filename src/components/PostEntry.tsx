import { contentImageStyle } from '@util/constants'
import { rgba, em, rgb, linearGradient, hsl } from 'csx'
import { Link } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'
import * as React from 'react'
import { style } from 'typestyle'

const articleLinkClassName = style({
    background: 0,
    textDecoration: 'none',
    $nest: {
        '&:hover': {
            background: 'none',
            $nest: {
                '& span, & a': {
                    color: 'white',
                    background: rgba(0, 149, 255, 0.5).toString(),
                },
                '& a': {
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
            marginBottom: 0,
            $nest: {
                '&>a': {
                    marginLeft: 0,
                    background: 'rgba(242, 242, 242, 0.79)',
                },
            },
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

interface Props {
    slug?: string
    title?: string | null
    date?: string | null
    excerpt?: string | null
    cover?: FluidObject | FluidObject[]
}

export default ({ slug, title, cover, excerpt, date }: Props) => {
    const a = 0
    return (
        <Link to={slug || '#'} className={articleLinkClassName}>
            <article className={postEntryClassName}>
                <div className={postInfoClassName}>
                    <h1>{slug ? <Link to={slug}>{title}</Link> : title}</h1>
                    <span>{date}</span>
                </div>
                {cover ? <Img fluid={cover} /> : <p className={excerptClassName}>{excerpt}</p>}
            </article>
        </Link>
    )
}
