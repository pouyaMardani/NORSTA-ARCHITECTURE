
const next = require("next");
const http = require("http");

const app = next({
  dev: false,
  dir: __dirname,
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen();

    console.log("Norsta Next.js server initialized");
  })
  .catch((error) => {
    console.error("Norsta startup failed:", error);
    process.exit(1);
  });
