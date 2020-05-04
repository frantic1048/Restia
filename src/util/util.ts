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
