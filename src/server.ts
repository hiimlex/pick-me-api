import "dotenv/config";
import App from "./app";

const PORT = process.env.PORT || 80; 

App.listen(PORT);
