import { ReplaceComponentRendererArgs } from 'gatsby'

export type DeepRequired<T> = {
    [P in keyof T]: DeepRequired<P>
}

export type GatsbyComponentRenderProps<TQuery = null> = Omit<ReplaceComponentRendererArgs['props'], 'data'> & {
    data: TQuery
}

export type GatsbyComponent<TQuery = null> = React.FC<GatsbyComponentRenderProps<TQuery>>
