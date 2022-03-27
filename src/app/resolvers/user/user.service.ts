import { Service } from "typedi"

@Service()
export class UserService {

  	async getOne() {
    	return "hello"
  	}

}