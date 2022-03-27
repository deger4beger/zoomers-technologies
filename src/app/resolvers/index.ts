import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { Container } from "typedi"
import { UserResolver } from "./user/user.resolver"

export async function generateSchema() {
	return await buildSchema({
	  	resolvers: [UserResolver],
	  	container: Container
	})
}