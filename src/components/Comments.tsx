import { percent, px } from 'csx'
import { DiscussionEmbed } from 'disqus-react'
import { graphql, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { style } from 'typestyle'
import useIsInViewport from 'use-is-in-viewport'

import { CommentsQuery } from '../types/graphql-types'
import { scaleAt } from '../util/constants'

const disqusClassName = style({
    // make it easier to tirgger
    minHeight: px(300),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    $nest: {
        '&>#disqus_thread': { width: percent(100) },
    },
})

interface Props {
    slug: string
    title: string
}

export default ({ slug, title }: Props) => {
    const data = useStaticQuery<CommentsQuery>(graphql`
        query Comments {
            site {
                siteMetadata {
                    siteUrl
                }
            }
        }
    `)
    const siteUrl = data.site?.siteMetadata?.siteUrl ?? ''
    const fullUrl = siteUrl && `${siteUrl}${slug}`

    const [isInViewport, targetRef] = useIsInViewport()
    const [commentsLoaded, setCommentsLoaded] = React.useState(false)

    React.useEffect(() => {
        if (isInViewport && siteUrl !== '' && window.location.origin === siteUrl) {
            setCommentsLoaded(true)
        }
    }, [isInViewport, commentsLoaded, siteUrl])

    return (
        <div className={disqusClassName}>
            {!commentsLoaded && <p className={style(...scaleAt(2))}>Comments...</p>}
            <div id="disqus_thread" ref={targetRef} />
            {commentsLoaded && (
                <DiscussionEmbed
                    shortname="pyonpyontoday"
                    config={{
                        url: fullUrl,
                        identifier: slug,
                        title,
                    }}
                />
            )}
        </div>
    )
}
