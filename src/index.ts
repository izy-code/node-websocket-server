import { frontendServer } from "./create-frontend-server/index";

const HTTP_PORT = 8181;

console.log(`Frontend server with game UI accessible via http://localhost:${HTTP_PORT}`);
frontendServer.listen(HTTP_PORT);
