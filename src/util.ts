import { BaseRecord, Database, SetEvent, Listener, PubSub } from './interface'




export const createObserver = <T>(): PubSub<T> => {
	let listeners: Array<Listener<T>> = []
	
	return {
		subscribe: (listener: Listener<T>): () => void => {
			listeners.push(listener)
			return () => {
				listeners = listeners.filter(l => l !== listener)
			}
		},
		publish: (event: T) => {
			listeners.forEach(l => l(event))
		}
	}
}



export const createDatabase = <T extends BaseRecord>() => {

	class InMemoryDatabase implements Database<T> {

		private db: Record<number, T> = {}

		private beforeAddListeners = createObserver<SetEvent<T>>()
		private afterSetListeners = createObserver<SetEvent<T>>()

		static instance: InMemoryDatabase = new InMemoryDatabase()

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		private constructor() { }

		public set(newValue: T): void {
			this.beforeAddListeners.publish({
				newValue,
				value: this.db[newValue.id]
			})
			this.db[newValue.id] = newValue

			this.afterSetListeners.publish({
				value: newValue
			})
		}

		public get(id: number): T | undefined {
			return this.db[id]
		}

		onBeforeAdd(listener: Listener<SetEvent<T>>): () => void {
			return this.beforeAddListeners.subscribe(listener)
		}

		onAfterAdd(listener: Listener<SetEvent<T>>): () => void {
			return this.afterSetListeners.subscribe(listener)
		}

		// Visitor
		visit(visitor: (item: T) => void): void {
			Object.values(this.db).forEach(visitor)
		}

		// Strategy
		selectBest(scoreStrat: (item: T) => number): T | undefined {

			const found: {
				max: number,
				item: T | undefined
			} = {
				max: 0,
				item: undefined
			}

			Object.values(this.db).reduce((f, currentItem) => {

				const score = scoreStrat(currentItem)
				if (score > f.max) {
					f.max = score
					f.item = currentItem
				}

				return f
			}, found)

			return found.item

		}

	}

	return InMemoryDatabase
}