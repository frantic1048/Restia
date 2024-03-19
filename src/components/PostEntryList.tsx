import { px } from 'csx'
import * as React from 'react'
import { style } from 'typestyle'

import type { PostEntryInfo } from '../components/PostEntry';
import PostEntry from '../components/PostEntry'
import { hiresMedia, largeMedia, smallMedia } from '../util/constants'

const postListClassName = style(
    {
        display: 'grid',
        gridAutoFlow: 'dense',
        gridGap: px(1),
        userSelect: 'none',
    },
    smallMedia({ gridTemplateColumns: `repeat(1, 1fr)` }),
    largeMedia({ gridTemplateColumns: `repeat(2, 1fr)` }),
    hiresMedia({ gridTemplateColumns: `repeat(3, 1fr)` }),
)

interface PostEntryInfoWithId extends PostEntryInfo {
    id: string
}

interface Props {
    /** up to 6 items, because of simple layout implement */
    postList: PostEntryInfoWithId[]
}

export default ({ postList }: Props) => (
    <div className={postListClassName} data-testid="postList">
        {postList.map(({ id, ...postInfo }) => (
            <PostEntry key={id} {...postInfo} />
        ))}
    </div>
)
