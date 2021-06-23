import { User } from './interface'
import { createDatabase } from './util'


// Usage Example
const UserDB = createDatabase<User>()


const unsubscribe = UserDB.instance.onAfterAdd(({ value }) => {
	console.log('After Add: ', value)
})


UserDB.instance.set({
	id: 1,
	first_name: 'Nathan',
	last_name: 'Beesley',
	score: 25
})

unsubscribe()

UserDB.instance.set({
	id: 2,
	first_name: 'Mary',
	last_name: 'Beesley',
	score: 75
})

UserDB.instance.visit((item) => {
	console.log('Visitor: ', item)
})

const bestScore = UserDB.instance.selectBest(({ score }) => score )

console.log('Best Score: ', bestScore)