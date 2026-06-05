import { DiscussionEmbed } from 'disqus-react'
import { useEffect, useState } from 'react'

interface Props {
    slug: string
    title: string
    siteUrl: string
}

/**
 * Disqus comments — React island loaded with client:visible.
 *
 * Only renders on the production domain to avoid loading Disqus
 * in development or preview environments.
 */
export default function Comments({ slug, title, siteUrl }: Props) {
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(() => {
        if (window.location.origin === siteUrl) {
            setShouldLoad(true)
        }
    }, [siteUrl])

    const fullUrl = `${siteUrl}${slug}`

    if (!shouldLoad) {
        return <p style={{ fontSize: 'calc(1rem * pow(var(--font-ratio-primary), 2))' }}>Comments...</p>
    }

    return <DiscussionEmbed shortname="pyonpyontoday" config={{ url: fullUrl, identifier: slug, title }} />
}
