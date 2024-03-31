const UserRoutes = require("./routes/user.routes");
const AuthenticationRoutes = require("./routes/authentication.route");

module.exports = (server) => {
    server.use("/api", AuthenticationRoutes);

    server.use("/api", UserRoutes);
}