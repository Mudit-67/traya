const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { v1 } = require("uuid");

const swaggerUi = require("swagger-ui-express");

const swaggerFile = require("./swagger_output.json");
const logger = require("./log/logger");

const server = express()

// PORT
const PORT = process.env.PORT || 3000

// CORS
server.use(cors());

server.listen(PORT, () => {
  logger.info(`Backend Server running on PORT: [${PORT}]`);
});

// Swagger
server.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use(express.json());
server.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Added headers with every request
server.use((req, res, next) => {
  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Expires", "0");
  // Timestamp for request
  req.timestamp = Date.now();
  // Unique Identifier
  req.correlationId = v1();
  logger.info(`API: ${req.path} | STATUS: REQUEST`);
  next();
});

const mongoUrl = process.env.URL
console.log(mongoUrl);
mongoose
  .connect(mongoUrl, {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to Database"))
  .catch((err) => logger.error("Failed to connect to Database:\n" + err));
const db = mongoose.connection;
db.on("open", () => {
  logger.info("Connection established");
});

require("./routes")(server);