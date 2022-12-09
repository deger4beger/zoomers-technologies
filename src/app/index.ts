import { Server, IncomingMessage, ServerResponse } from "http"
import fastify, { FastifyInstance, FastifyRegisterOptions } from "fastify"
import mercurius, { MercuriusOptions } from "mercurius"
import cors from "fastify-cors"
import helmet from "fastify-helmet"

import { requestSerializer, responseSerializer } from "./serializers"
import { config } from "../lib/config"
import { generateSchema } from "./resolvers"

export class FastifyCore {

	private readonly server: FastifyInstance<Server, IncomingMessage, ServerResponse>

	constructor() {
		this.server = fastify({
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

		this.server.register(helmet, config.helmet)
		this.server.register(cors)

	}

	async listen(): Promise<unknown> {
		try {
			await this.registerGraphqlServer()
			return this.server.listen(config.port, config.host)
		} catch (err) {
			this.server.log.error(err)
			process.exit(1)
		}
	}

	private async registerGraphqlServer() {
		const schema = await generateSchema()
		const opts: FastifyRegisterOptions<MercuriusOptions> = {
			schema,
			graphiql: true
		}
		this.server.register(mercurius, opts)
	}

}