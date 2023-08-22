// See: https://github.com/fastify/fastify-cors#options
export default {
    origin: '*',
    methods: ['GET', 'POST', "DELETE", "PUT"],
    credentials: true,
}
