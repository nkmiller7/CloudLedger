const initialize_routes = (app) => {
    app.use("{*splat}", (req, res) => {
        res.status(404).json({ message: "page not found" });
    });
};

export default initialize_routes;