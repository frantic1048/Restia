import 'core-js/proposals/string-cooked'

declare global {
    interface StringConstructor {
        // https://github.com/zloirock/core-js?tab=readme-ov-file#stringcooked
        cooked(this: void, template: readonly string[], ...substitutions: unknown[]): string
    }
}

export const graphql = String.cooked
