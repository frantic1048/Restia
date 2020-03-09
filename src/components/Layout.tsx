import * as React from 'react'
import { style, cssRule, classes } from 'typestyle'
import { rgb, linearGradient, deg, rgba, viewHeight, rem, em } from 'csx'
import { graphql, useStaticQuery, Link, GatsbyLinkProps } from 'gatsby'
import { LayoutQuery } from '../../types/graphql-types'
import { scaleAt } from '../util/constants'
import Helmet from 'react-helmet'

const layoutClassName = style({
    padding: rem(2),
    minHeight: viewHeight(100),
    boxSizing: 'border-box',
})

const headerClassName = style(
    {
        color: rgb(253, 255, 245).toHexString(),
    },
    ...scaleAt(3),
)

const navLinkClassName = style(
    {
        marginRight: em(1),
        $nest: {
            '&.active': {
                fontWeight: 'bold',
                fontStyle: 'italic',
            },
        },
    },
    ...scaleAt(1),
)

interface LayoutProps {
    children: React.ReactNode
    className?: string
    pageTitle?: string
    pageImage?: string
    pageDescription?: string
    /** related to root, leading slash is NEEDED */
    pageUrl?: string
}

// MEMO: is anything wrong here :thingking:?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavLink = React.forwardRef(({ activeClassName, ...props }: GatsbyLinkProps<{}>, ref: any) => (
    <Link className={navLinkClassName} activeClassName={activeClassName ?? 'active'} {...props} ref={ref} />
))

/**
 * some global rules
 */
cssRule('html, body', {
    padding: 0,
    margin: 0,
    background: [
        // Xjbg
        linearGradient(deg(257), rgba(179, 232, 255, 0.6), rgba(255, 0, 0, 0)),
        linearGradient(deg(167), rgba(0, 0, 255, 0.45), rgba(255, 0, 0, 0)),
        linearGradient(deg(376), rgba(135, 206, 251, 0.7), rgba(255, 0, 0, 0)),
        rgb(253, 255, 245).toHexString(),
    ].join(','),
    backgroundAttachment: 'fixed',
})
cssRule('h1', ...scaleAt(2))
cssRule('h2', ...scaleAt(1))
cssRule('h3', ...scaleAt(-1))
cssRule('h4', ...scaleAt(-2))
cssRule('h5', ...scaleAt(-3))
cssRule('h6', ...scaleAt(-4))

/**
 * Top level layout container
 */
const Layout = ({ children, className, pageTitle, pageImage, pageUrl, pageDescription }: LayoutProps) => {
    const data = useStaticQuery<LayoutQuery>(graphql`
        query layout {
            site {
                siteMetadata {
                    title
                    description
                    image
                    siteUrl
                }
            }
        }
    `)

    const description = pageDescription ?? data.site?.siteMetadata?.description ?? ''

    const url = `${data.site?.siteMetadata?.siteUrl ?? ''}${pageUrl ?? ''}`

    const image = pageImage ?? data.site?.siteMetadata?.image ?? ''

    const baseTitle = data.site?.siteMetadata?.title ?? ''
    const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
    const title = `${titlePrefix}${baseTitle}`

    /**
     * TODO
     *
     * structured data
     * https://developers.google.com/search/docs/guides/intro-structured-data
     */
    return (
        <div className={classes(layoutClassName, className)}>
            <Helmet>
                <meta charSet="utf-8" />
                <link rel="shortcut icon" type="image/png" href="/favicon.png" />
                <link rel="shortcut icon" sizes="192x192" href="/favicon-192x192.png" />
                <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png" />
                <meta name="msapplication-TileColor" content="#3b6ece" />
                <meta name="theme-color" content="#ffffff" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="image" content={image} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={url} />
                <meta property="og:image" content={image} />
            </Helmet>
            <header className={headerClassName}>{data.site?.siteMetadata?.title ?? ''}</header>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/posts">Archive</NavLink>
            </nav>
            <main>{children}</main>
        </div>
    )
}
export default Layout
