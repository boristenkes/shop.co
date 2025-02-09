export type SearchParams = Record<string, string | string[] | undefined>

export type NonNullableObj<T> = {
	[K in keyof T]: NonNullable<T[K]>
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
