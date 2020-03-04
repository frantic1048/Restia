const typestyle = require('typestyle')
const constants = require('./constants')

/**
 * MEMO:
 * Do not destructure on typestyle nor using es6 module,
 * or setStylesTarget cannot be resolved.
 *
 * weird... seems to be webpack module resolution related issue :thingking:
 */
const setStyleTarget = typestyle.setStylesTarget

const { defaultStyleId } = constants

exports.onClientEntry = (_, { styleTargetId = defaultStyleId }) => {
    let styleTarget = document.getElementById(styleTargetId)
    if (!styleTarget) {
        const newStyleEl = document.createElement('style')
        newStyleEl.setAttribute('id', styleTargetId)
        styleTarget = document.head.appendChild(newStyleEl)
    }
    setStyleTarget(styleTarget)
}
