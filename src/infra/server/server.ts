import express from "express";
import routes from "../../modules/routes"

const server = express();
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
server.use(express.json({ limit: "200mb" }));
server.use(routes);

export default server;