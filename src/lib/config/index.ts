export const config = {
	port: <number>Number(<string>process.env.PORT) || 8080,
	host: <string>process.env.host || "0.0.0.0",
	logger: {
    prettyPrint: <boolean>(process.env.LOGGING_PRETTY_PRINT === 'true' || true), // change if .env
    level: <string>process.env.LOGGING_LEVEL || 'info'
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
      	defaultSrc: [`'self'`],
      	styleSrc: [`'self'`, `'unsafe-inline'`],
      	imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
     		scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
    	}
  	}
  },
}