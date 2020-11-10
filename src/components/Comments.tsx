import * as React from 'react'
import useIsInViewport from 'use-is-in-viewport'
import { CommentsQuery } from '@restia-gql'
import { graphql, useStaticQuery } from 'gatsby'
import { DiscussionEmbed } from 'disqus-react'

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
        if (isInViewport && fullUrl) {
            setCommentsLoaded(true)
        }
    }, [isInViewport, commentsLoaded, fullUrl])

    return (
        <>
            <div id="disqus_thread" ref={targetRef} />
            {commentsLoaded && (
                <DiscussionEmbed
                    shortname="pyonpyontoday"
                    config={{
                        url: fullUrl,
                        identifier: slug,
                        title,
                    }}
                >
                    Comments
                </DiscussionEmbed>
            )}
        </>
    )
}
