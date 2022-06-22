import {
    belongsTo,
    createServer,
    hasMany,
    Model
} from "miragejs"

createServer({
    models: {
        movie: Model.extend({
            actors: hasMany()
        }),
        actor: Model.extend({
            movie: belongsTo()
        })
    },
    seeds(server) {
        server.create("movie", { name: "Anything", year: 2012 })
        server.create("movie", { name: "Everything", year: 2001 })
        server.create("movie", { name: "Anymore", year: 2007 })
    },
    routes() {
        this.namespace = "api"

        this.get("/movies", (schema, request) => {
            return schema.movies.all()
        })

        this.get("/movies/:id", (schema, request) => {
            let id = request.params.id

            return schema.movies.find(id)
        })

        this.post("/movies", (schema, request) => {
            let attrs = JSON.parse(request.requestBody)

            return schema.movies.create(attrs)
        })

        this.patch("/movies/:id", (schema, request) => {
            let newAttrs = JSON.parse(request.requestBody)
            let id = request.params.id
            let movie = schema.movies.find(id)

            return movie.update(newAttrs)
        })

        this.delete("/movies/:id", (schema, request) => {
            let id = request.params.id

            return schema.movies.find(id).destroy()
        })
    },
})