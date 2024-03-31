require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes"];

const doc = {
  info: {
    title: "Traya Backend Assignment",
    description: "Backend Assignment",
  },
  securityDefinitions: {
    jwt: { type: "apiKey", in: "header", name: "Authorization" },
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server");
});
