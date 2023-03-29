import app from './server/server.js';
import { config } from './server/config/index.js';

app.listen(config.port, () => {
  console.log(`Connected to http://localhost:${config.port}`);
});