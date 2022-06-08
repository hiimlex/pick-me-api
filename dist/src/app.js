"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const server_1 = require("./api/server");
const PORT = process.env.PORT || 80;
const server = new server_1.Server();
server.listen(PORT);
