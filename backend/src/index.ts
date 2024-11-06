import app from './app';
import * as http from 'http';

const port = process.env.PORT || 2024;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'));
});
