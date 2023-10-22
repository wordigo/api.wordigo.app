const Config = {
  confKey: 'config',
  schema: {
    type: 'object',
    properties: {
      PORT: {
        type: 'number',
        default: 8080,
      },
      BIND_ADDR: {
        type: 'string',
        default: '127.0.0.1',
      },
      APP_SERVER_NAME: {
        type: 'string',
        default: 'localhost',
      },
      PROJECT_NAME: {
        type: 'string',
        default: 'fastify-rest',
      },
      JWT_SECRET: {
        type: 'string',
      },
      SESSION_SECRET: {
        type: 'string',
      },
      ENABLE_SWAGGER: {
        type: 'string',
        default: true,
      },
    },
  },
}

export default Config
