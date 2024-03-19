export const groupBy = <TItem>(list: TItem[], resolveGroupNameFromItem: (item: TItem) => string | number) => {
    const result: { [key in ReturnType<typeof resolveGroupNameFromItem>]: TItem[] } = {}

    for (const item of list) {
        const groupName = resolveGroupNameFromItem(item)
        if (Array.isArray(result[groupName])) {
            result[groupName].push(item)
        } else {
            result[groupName] = [item]
        }
    }

    return result
}

/**
 * shuffle elements in a list
 *
 * ported from old logdown about.md
 * http://stackoverflow.com/a/2450976
 */
export const shuffle = <T>(list: T[]): T[] => {
    let currentIndex = list.length
    let temporaryValue: T
    let randomIndex: number

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = list[currentIndex]
        list[currentIndex] = list[randomIndex]
        list[randomIndex] = temporaryValue
    }

    return list
}
