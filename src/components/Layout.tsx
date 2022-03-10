import * as React from 'react'
import { style, cssRule, classes } from 'typestyle'
import { rgb, viewHeight, em, rgba, px, rem, percent, url, translateZ, scale } from 'csx'
import { graphql, useStaticQuery, Link, GatsbyLinkProps } from 'gatsby'
import { LayoutQuery } from '@restia-gql'
import { baseFontSize, scaleAt, smallMedia } from '@util/constants'
import { Helmet } from 'react-helmet'
import { NestedCSSProperties } from 'typestyle/src/types'

/**
 * some global rules
 */
cssRule('html', {
    padding: 0,
    margin: 0,
    color: rgb(70, 70, 70).toString(),
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

const layoutClassName = style({
    position: 'relative',
    minHeight: viewHeight(100),
    boxSizing: 'border-box',
})

const perspective = 1000
/**
 * @param z in px, should be smaller than {@link perspective}
 * @returns CSS transform rule string
 */
const getParallaxItemTransform = (z: number): string => [translateZ(px(z)), scale(1 - z / perspective)].join(' ')
const transformOrigin = 'bottom center'
const parallaxContainerClassName = style({
    position: 'relative',
    top: 0,
    left: 0,
    height: viewHeight(100),
    width: percent(100),
    overflowX: 'hidden',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    perspective: px(perspective),
    perspectiveOrigin: transformOrigin,
})
const parallaxBackgroundLayerStyle: NestedCSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin,
    pointerEvents: 'none',
}
const parallaxForegroundClassName = style(
    {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: viewHeight(100),
        transform: getParallaxItemTransform(0),
        transformOrigin,
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        padding: `0 ${em(0.5)}`,
        $nest: { '&:focus': { outline: 'none' } },
    },
    smallMedia({
        flexDirection: 'column',
    }),
)
/** TODO: combine these SVG image after new design is done */
const parallaxBackgroundLayer1ClassName = style(parallaxBackgroundLayerStyle, {
    background: [`left top / 50px repeat scroll ${url('/image/bg-pattern.svg')}`, `#f3faff`].join(','),
    transform: getParallaxItemTransform(-1000),
})
const parallaxBackgroundLayer2ClassName = style(parallaxBackgroundLayerStyle, {
    background: `left top / 500px repeat scroll ${url('/image/bg-pattern-flowers.svg')}`,
    transform: getParallaxItemTransform(-600),
})
const parallaxBackgroundLayer3ClassName = style(parallaxBackgroundLayerStyle, {
    background: `left top / 800px repeat scroll ${url('/image/bg-pattern-flowers2.svg')}`,
    transform: getParallaxItemTransform(-300),
})

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

    const parallaxForegroundElement = React.createRef<HTMLDivElement>()
    React.useEffect(() => {
        // by default brower focus to body element
        // which not scrollable with keyboard, because it has
        // smaller height(100vh) than actual content
        if (parallaxForegroundElement.current) {
            parallaxForegroundElement.current.focus()
        }
    }, [])

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
                    rel="preload"
                    href="https://fonts.googleapis.com/css2?family=Viaoda+Libre&family=Noto+Serif+SC&display=swap"
                    as="style"
                />
            </Helmet>
            <div className={parallaxContainerClassName}>
                <div className={parallaxForegroundClassName} tabIndex={-1} ref={parallaxForegroundElement}>
                    <div className={parallaxBackgroundLayer1ClassName} />
                    <div className={parallaxBackgroundLayer2ClassName} />
                    <div className={parallaxBackgroundLayer3ClassName} />
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
            </div>
        </div>
    )
}
export default Layout
