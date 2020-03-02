import * as React from 'react'
import { style, cssRule, classes, getStyles } from 'typestyle'
import { rgb, linearGradient, deg, rgba, viewWidth, viewHeight, rem, em } from 'csx'
import { graphql, useStaticQuery, Link, GatsbyLinkProps } from 'gatsby'
import { LayoutQuery } from '../../types/graphql-types'
import { scaleAt } from '../util/constants'
import { Helmet } from 'react-helmet'

const layoutClassName = style({
    margin: rem(2),
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
}

// MEMO: is anything wrong here :thingking:?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavLink = React.forwardRef(({ activeClassName, ...props }: GatsbyLinkProps<{}>, ref: any) => (
    <Link className={navLinkClassName} activeClassName={activeClassName ?? 'active'} {...props} ref={ref} />
))

/**
 * Top level layout container
 */
const Layout = ({ children, className }: LayoutProps) => {
    React.useEffect(() => {
        cssRule('html, body', {
            padding: 0,
            margin: 0,
            height: viewHeight(100),
            width: viewWidth(100),
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
    }, [])

    const data = useStaticQuery<LayoutQuery>(graphql`
        query layout {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <div className={classes(layoutClassName, className)}>
            <Helmet>
                <style>{getStyles()}</style>
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
