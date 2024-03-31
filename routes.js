const UserRoutes = require("./routes/user.routes");
const AuthenticationRoutes = require("./routes/authentication.route");

module.exports = (server) => {
    server.use("/v1/auth", AuthenticationRoutes);

    server.use("/api/v1/user", UserRoutes);
}