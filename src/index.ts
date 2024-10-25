import 'dotenv/config';
import { DEFAULT_FRONTEND_PORT } from './common/constants';
import { frontendServer } from './frontend-server/index';

const frontendPort = Number(process.env.FRONTEND_PORT) || DEFAULT_FRONTEND_PORT;

frontendServer.listen(frontendPort, () => {
  console.log(`Frontend server with game UI accessible via http://localhost:${frontendPort}`);
});
