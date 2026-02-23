import users_routes from "./users.js";
import categories_routes from "./categories.js";

const initialize_routes = (app) => {
    app.use("/api/users", users_routes);
    app.use("/api/categories", categories_routes);
    app.use("{*splat}",  (req, res) => {
        res.status(404).json({ reason: "page not found" });
    });
};

export default initialize_routes;