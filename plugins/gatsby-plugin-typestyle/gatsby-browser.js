import { setStylesTarget } from 'typestyle'

import { defaultStyleId } from './constants'

export const onInitialClientRender = (_, { styleTargetId = defaultStyleId }) => {
    let styleTarget = document.getElementById(styleTargetId)
    if (!styleTarget) {
        // actually this should not happen if SSR works properly
        const newStyleEl = document.createElement('style')
        newStyleEl.setAttribute('id', styleTargetId)
        styleTarget = document.head.appendChild(newStyleEl)
    }
    setStylesTarget(styleTarget)
}
