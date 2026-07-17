import http from 'http';
import app from './app';
import { connectDB } from './database/db';
import { PORT } from './config';
import { initSocket } from './services/socket.service';

async function startServer() {
  await connectDB();

  // Create an HTTP server wrapping Express so socket.io can attach to it.
  const server = http.createServer(app);

  // Initialize socket.io on the same HTTP server (shares the port).
  initSocket(server);

  server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
}

startServer();
