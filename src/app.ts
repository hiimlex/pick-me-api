require("dotenv").config();
import { Server } from "./api/server";

const PORT = 3000 || process.env.PORT;
const server = new Server();

server.listen(PORT);
