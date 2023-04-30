import path from 'path';
import express from 'express';
import compress from 'compression';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathIndex = path.join(__dirname, 'dist');
const cacheTime = 86400000 * 7;

const server = express();
server.use(
  history({
    logger: console.log.bind(console),
  })
);

server.use(compress({ threshold: 512 }));
server.use(express.static(pathIndex, { maxAge: cacheTime }));
server.disable('x-powered-by');
server.listen(PORT, () => {
  console.log(`[OK] Server is running on PORT = ${PORT}`);
});
