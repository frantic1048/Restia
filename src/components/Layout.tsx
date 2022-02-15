import * as React from 'react'
import { style, cssRule, classes } from 'typestyle'
import { rgb, viewHeight, em, rgba, px, rem, percent } from 'csx'
import { graphql, useStaticQuery, Link, GatsbyLinkProps } from 'gatsby'
import { LayoutQuery } from '@restia-gql'
import { baseFontSize, scaleAt, smallMedia } from '@util/constants'
import { Helmet } from 'react-helmet'

/**
 * some global rules
 */
cssRule('html', {
    padding: 0,
    margin: 0,
    color: rgb(70, 70, 70).toString(),
    backgroundColor: '#fbfbfb',
    fontSize: px(baseFontSize),
    fontFamily: `"Viaoda Libre","Noto Serif SC",serif`,
})
cssRule('body', {
    margin: 'auto',
})
cssRule('a', {
    textDecoration: 'underline dotted',
    color: 'currentColor',
    padding: `${em(0)} ${em(0.2)}`,
    $nest: {
        '&:visited': {},
        '&:hover,&:focus': {
            textDecorationStyle: 'solid',
            color: 'white',
            background: rgba(0, 149, 255, 0.5).toString(),
        },
        '&:active': {},
    },
})
cssRule('h1', ...scaleAt(2))
cssRule('h2', ...scaleAt(1))
cssRule('h3', ...scaleAt(0))
cssRule('h4', ...scaleAt(-1))
cssRule('h5', ...scaleAt(-2))
cssRule('h6', ...scaleAt(-3))

/** for markdown inline class name usage */
cssRule('.font-scale-2', ...scaleAt(2))
cssRule('.font-scale-1', ...scaleAt(1))
cssRule('.font-scale-0', ...scaleAt(0))
cssRule('.font-scale--1', ...scaleAt(-1))
cssRule('.font-scale--2', ...scaleAt(-2))

const layoutClassName = style(
    {
        minHeight: viewHeight(100),
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
    },
    smallMedia({ padding: `0 ${em(1)}`, flexDirection: 'column' }),
)

const navClassName = style(
    {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
        userSelect: 'none',
    },
    smallMedia({ justifyContent: 'center' }),
)

const headerClassName = style({
    maxWidth: em(55),
})

const logoLinkClassName = style({
    $nest: {
        '&:hover,&:focus': { background: 'transparent' },
    },
})
const logoImgClassName = style({
    height: rem(8),
    /** TODO: gather this through gatsby */
    aspectRatio: '714 / 292',
})

const navLinkWrapperClassName = style(
    {
        marginTop: em(2),
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: percent(50),
        lineHeight: 1.8,
    },
    smallMedia({
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: percent(100),
        maxWidth: em(30),
    }),
)

const navLinkClassName = style(
    {
        $nest: {
            '&.active': {
                fontWeight: 'bold',
                fontStyle: 'italic',
                textDecorationStyle: 'solid',
            },
        },
    },
    ...scaleAt(1),
)

const layoutContentClassName = style({ width: percent(100) })

interface LayoutProps {
    children: React.ReactNode
    className?: string
    /** className of <main> */
    contentClassName?: string
    pageTitle?: string
    pageImage?: string
    pageDescription?: string
    /** related to root, leading slash is NEEDED */
    pageUrl?: string
}

// MEMO: is anything wrong here :thingking:?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavLink = React.forwardRef(({ activeClassName, ...props }: GatsbyLinkProps<unknown>, ref: any) => (
    <Link className={navLinkClassName} activeClassName={activeClassName ?? 'active'} {...props} ref={ref} />
))

/**
 * Top level layout container
 */
const Layout = ({
    children,
    className,
    contentClassName,
    pageTitle,
    pageImage,
    pageUrl,
    pageDescription,
}: LayoutProps) => {
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

    const siteUrl = data.site?.siteMetadata?.siteUrl ?? ''
    const fullUrl = `${siteUrl}${pageUrl ?? ''}`

    const image = pageImage ?? data.site?.siteMetadata?.image ?? ''

    /**
     * twitter likes full URL
     *
     * ref:
     * https://twittercommunity.com/t/not-whitelisted-unable-to-render-or-no-image-read-this-first/62736
     */
    const twitterImage = `${siteUrl}${image}`

    const siteName = data.site?.siteMetadata?.title ?? ''
    const titlePrefix = pageTitle ? `${pageTitle} | ` : ''
    const title = `${titlePrefix}${siteName}`

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
                <meta name="msapplication-TileColor" content="#3b6ece" />
                <meta name="theme-color" content="#ffffff" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="image" content={image} />
                {pageTitle && <meta property="og:title" content={pageTitle} />}
                <meta property="og:site_name" content={siteName} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={fullUrl} />
                <meta property="og:image" content={image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle ?? siteName} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={twitterImage} />
                <link rel="alternate" type="application/rss+xml" href="/rss.xml" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Viaoda+Libre&family=Noto+Serif+SC&display=swap"
                />
            </Helmet>
            <nav className={navClassName}>
                <header className={headerClassName} role="banner">
                    <NavLink to="/" className={logoLinkClassName}>
                        <img className={logoImgClassName} src="/image/logo.svg" alt="Pyon Pyon Today" />
                    </NavLink>
                </header>
                <div className={navLinkWrapperClassName}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/posts">Archive</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/rss.xml" rel="alternate" type="application/rss+xml">
                        RSS
                    </NavLink>
                </div>
            </nav>
            <main className={classes(layoutContentClassName, contentClassName)}>{children}</main>
        </div>
    )
}
export default Layout
