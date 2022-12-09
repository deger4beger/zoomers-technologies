import { Query, Resolver } from "type-graphql"
import { Service } from "typedi"

import { User } from "./types"
import { UserService } from "./user.service"

@Service()
@Resolver(of => User)
export class UserResolver {

  constructor(private userService: UserService) {}

  @Query(returns => User)
	user(): User {
	  return this.userService.getOne()
	}

}