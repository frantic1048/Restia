export type DeepRequired<T> = {
    [P in keyof T]: DeepRequired<P>
}
