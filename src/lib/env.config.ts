const Config = {
  confKey: 'config',
  schema: {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: {
      PORT: {
        type: 'number',
        default: 4000,
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
      DATABASE_URL: {
        type: 'string',
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
