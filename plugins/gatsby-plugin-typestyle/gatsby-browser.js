import { setStylesTarget } from 'typestyle'
import { defaultStyleId } from './constants'

export const onClientEntry = (_, { styleTargetId = defaultStyleId }) => {
    /**
     * MEMO:
     *
     * Typically, we should use the same style element in SSR as typestyle stylesTarget.
     *
     * BUT, typestyle clears the style element after calling setStylesTarget,
     * and then fill CSS back to the target element.
     * It causes page loses style for a moment during loading.
     *
     * We use different style element from SSR rendering,
     * to avoid the above issue.
     */
    const clientStyleTargetId = `${styleTargetId}-client`
    let styleTarget = document.getElementById(clientStyleTargetId)
    if (!styleTarget) {
        const newStyleEl = document.createElement('style')
        newStyleEl.setAttribute('id', clientStyleTargetId)
        styleTarget = document.head.appendChild(newStyleEl)
    }
    setStylesTarget(styleTarget)
}
