// See: https://github.com/fastify/fastify-cors#options
export default {
  origin: "*",
  methods: "OPTION, GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  exposedHeaders: "Authorization",
};
