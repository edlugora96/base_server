const path = require("path");
const express = require("express");
const chalk = require("chalk");
const helmet = require("helmet");
// const slash = require("express-slash");
const cors = require("cors");
const timeout = require("connect-timeout");
const { startIO } = require("./socket.js");
const { imagesApi } = require("gora-api");
const {
  middlewares: {
    notFoundHandler,
    errorHandler: { logErrors, errorHandler, wrapErrors },
  },
} = require("gora-utils");

const config = require("config")();

const corsOptions = {
  origin: config.cors,
};

const app = express();

// Utils
// app.use(slash());

// Security
app.use(cors(corsOptions));
app.use(helmet());

// body parser
app.use(express.json());

// Loading APIs
imagesApi(app);

app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

// Catch 404
app.use(notFoundHandler);

// Error Handler middleware
// eslint-disable-next-line
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  // eslint-disable-next-line
  console.log(
    `${chalk.blueBright("[server On]:")} Listening http://${config.host}:${
      config.port
    }`
  );
});
const handleFatalError = (error) => {
  // eslint-disable-next-line
  console.error(`${chalk.redBright("[Fatal Error]:")} ${error.message}`);
  if (config.env) {
    // eslint-disable-next-line
    console.error(error.stack);
  }
  process.exit(1);
};
process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
