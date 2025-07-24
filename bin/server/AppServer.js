import kernel from "../../framework/App/Kernel.js";
import http from 'http';
import net from 'net';

class AppServer {
  
  static start() {
    new AppServer().findAvailablePort().then((port) => {
      http
        .createServer((req, res) => {
          new kernel(req, res);
        })
        .listen(port, () => {
          const URL = `http://localhost:${port}`;
          console.log(`✔  Server running on port ${port}`);
          console.log(
            '\x1b[36m%s\x1b[0m',
            `🔗 Local: ${URL}`
          );
        });
    });
  }

  findAvailablePort(startPort = 3000, endPort = 3100) {
    return new Promise((resolve, reject) => {
      let port = startPort;

      const tryPort = () => {

        const server = net.createServer();

        server.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            port++;
            if (port > endPort) {
              reject(new Error('No available ports found'));
            } else {
              tryPort();
            }
          } else {
            reject(err);
          }
        });

        server.once('listening', () => {
          server.close(() => resolve(port));
        });

        server.listen(port, '0.0.0.0');
      };

      tryPort();
    });
  }
}


AppServer.start();
