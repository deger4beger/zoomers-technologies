import { FastifyCore } from "./app"

async function main() {
	const app = new FastifyCore()
	await app.listen()
}

main()