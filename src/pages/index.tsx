import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { oc } from 'ts-optchain'
import { GatsbyComponent } from 'util/types'
import { SiteMetadataQuery } from '../../types/graphql-types'

export const query = graphql`
    query siteMetadata {
        site {
            siteMetadata {
                title
            }
        }
    }
`

const Page: GatsbyComponent<SiteMetadataQuery> = ({ data }) => {
    return (
        <div>
            Welcome to <b>{oc(data).site.siteMetadata.title('')}</b>
            <p>
                <Link to="/posts">Pyon Pyon Posts</Link>
            </p>
        </div>
    )
}
export default Page
