import { graphql } from 'gatsby'
import * as React from 'react'
import { oc } from 'ts-optchain'
import { GatsbyComponent } from 'util/types'
import { SiteMetadataQuery } from '../../types/graphql-types'

const Page: GatsbyComponent<SiteMetadataQuery> = z => {
    const data = z.data
    return (
        <div>
            Welcome to <b>{oc(data).site.siteMetadata.title('')}</b>
        </div>
    )
}
export default Page
export const query = graphql`
    query siteMetadata {
        site {
            siteMetadata {
                title
            }
        }
    }
`
