const logger = require("../log/logger");

const statusMessage = {
  200: "ok",
  204: "Successfully logout",
  400: "There are some missing or invalid values in your request.",
  401: "Your token have expired or you are unauthorized",
  403: "You don't have permission to access this site.",
  404: "Resource not found",
  500: "Something went wrong. Please try again later",
  502: "Database connection failed",
};

const formatResponse = (response, data = {}, status = 200) => {
  const responseBody = {
    status,
    error: false,
    count: 0,
    issues: [],
    data: {},
    message: statusMessage[status],
  };

  if (status < 300) {
    if (Array.isArray(data)) {
      responseBody.data = {
        items: data,
      };
      responseBody.count = data.length;
    } else {
      if (data?.success) {
        responseBody.data = data.data || {};
      } else {
        responseBody.data = data || {};
      }
      responseBody.count = 1;
    }
    logger.info(
      `API: ${response.req.path} | STATUS: ${status} | LENGTH: ${responseBody.count}`
    );
    response.status(status).json(responseBody);
  } else {
    responseBody.issues = data;
    responseBody.error = true;
    delete responseBody.issues?.success;
    delete responseBody.issues?.status;
    logger.error(
      `API: ${response.req.path} | STATUS: ${status} | Reason: ${JSON.stringify(
        responseBody
      )}`
    );
    delete responseBody.issues?.server_stack;
    response.status(status).json(responseBody);
  }
};

module.exports = {
  formatResponse
};
