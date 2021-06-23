export interface SetEvent<T> {
	value: T,
	newValue?: T
}

export interface User {
	id: number
	first_name: string
	last_name: string
	score: number
}

export interface BaseRecord {
	id: number
}

export interface Database<T extends BaseRecord> {
	set(newValue: T): void
	get(id: number): T | undefined
	onBeforeAdd(listener: Listener<SetEvent<T>>): () => void
	onAfterAdd(listener: Listener<SetEvent<T>>): () => void
	visit(visitor: (item: T) => void): void;
}

export interface PubSub<T> {
	subscribe: (listener: Listener<T>) => () => void
	publish: (event: T) => void
}

export type Listener<T> = (ev: T) => void
