import { Query, Resolver } from "type-graphql"

import { User } from "./types"
import { UserService } from "./user.service"

@Resolver(of => User)
export class UserResolver {

  	constructor(private userService: UserService) {}

  	@Query(returns => String)
	user() {
	    return this.userService.getOne()
	}

}