import { setStylesTarget } from 'typestyle'
import { defaultStyleId } from './constants'

export const onClientEntry = (_, { styleTargetId = defaultStyleId }) => {
    let styleTarget = document.getElementById(styleTargetId)
    if (!styleTarget) {
        const newStyleEl = document.createElement('style')
        newStyleEl.setAttribute('id', styleTargetId)
        styleTarget = document.head.appendChild(newStyleEl)
    }
    setStylesTarget(styleTarget)
}
