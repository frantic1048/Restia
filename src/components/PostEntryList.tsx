import PostEntry, { PostEntryInfo } from '@components/PostEntry'
import * as React from 'react'

interface PostEntryInfoWithId extends PostEntryInfo {
    id: string
}

interface Props {
    postList: PostEntryInfoWithId[]
}

export default ({ postList }: Props) => (
    <div>
        {postList.map(({ id, ...postInfo }) => (
            <PostEntry key={id} {...postInfo} />
        ))}
    </div>
)
