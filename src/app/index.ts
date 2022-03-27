import fastify, { FastifyInstance } from "fastify"
import { Server, IncomingMessage, ServerResponse } from "http"
import { ApolloServerPlugin } from "apollo-server-plugin-base"
import { ApolloServer } from "apollo-server-fastify"

import { requestSerializer, responseSerializer } from "./serializers"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import { config } from "../lib/config"
import { generateSchema } from "./resolvers"

export class FastifyCore {

	private readonly fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

	constructor() {
		this.fastify = fastify({
			logger: {
				level: config.logger.level,
                prettyPrint: config.logger.prettyPrint,
                redact: ["req.headers.authorization"],
                serializers: {
                    res: responseSerializer,
                    req: requestSerializer,
                },
			} as any
		})
		this.fastify.ready(() => {
			console.log(this.fastify.printPlugins())
		})
	}

	async listen(): Promise<unknown> {
		try {
			await this.startApolloServer()
			return this.fastify.listen(config.port, config.host)
		} catch (err) {
			this.fastify.log.error(err)
			process.exit(1)
		}
	}

	private fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
	  	return {
	    	async serverWillStart() {
	      		return {
			        async drainServer() {
			          	await app.close()
			        }
			    }
	   		}
	  	}
	}

	private async startApolloServer(): Promise<void> {
		const schema = await generateSchema()
	  	const apolloServer = new ApolloServer({
	    	schema,
	    	plugins: [
	      		this.fastifyAppClosePlugin(this.fastify),
	      		ApolloServerPluginDrainHttpServer({ httpServer: this.fastify.server })
	    	]
	  	})
	  	await apolloServer.start()
	  	this.fastify.register(apolloServer.createHandler())
	}

}