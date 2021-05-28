import PostEntry, { PostEntryInfo } from '@components/PostEntry'
import { hiresMedia, largeMedia, smallMedia } from '@util/constants'
import { px } from 'csx'
import * as React from 'react'
import { style } from 'typestyle'

const postListClassName = style(
    {
        display: 'grid',
        gridAutoFlow: 'dense',
        gridGap: px(1),
    },
    smallMedia({ gridTemplateColumns: `repeat(1, 1fr)` }),
    largeMedia({ gridTemplateColumns: `repeat(2, 1fr)` }),
    hiresMedia({ gridTemplateColumns: `repeat(2, 1fr)` }),
)

interface PostEntryInfoWithId extends PostEntryInfo {
    id: string
}

interface Props {
    /** up to 6 items, because of simple layout implement */
    postList: PostEntryInfoWithId[]
}

export default ({ postList }: Props) => (
    <div className={postListClassName}>
        {postList.map(({ id, ...postInfo }) => (
            <PostEntry key={id} {...postInfo} />
        ))}
    </div>
)
