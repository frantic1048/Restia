import * as React from 'react'
import { getStyles } from 'typestyle'
import { renderToString } from 'react-dom/server'
import { defaultStyleId } from './constants'

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }, { styleTargetId = defaultStyleId }) => {
    replaceHeadComponents([
        ...getHeadComponents(),
        React.createElement('style', {
            key: styleTargetId,
            id: `${styleTargetId}-ssr`,
            dangerouslySetInnerHTML: { __html: getStyles() },
        }),
    ])
}
