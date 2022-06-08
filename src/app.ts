require("dotenv").config();
import { Server } from "./api/server";

const PORT = process.env.PORT || 80;
const server = new Server();

server.listen(PORT);

