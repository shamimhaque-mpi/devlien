import http from "http";
import kernel from "../../framework/App/Kernel.js";

export default class Listener {
    static active(port = 3000) {
        const tryStartServer = (currentPort) => {
            const server = http.createServer((req, res) => {
                new kernel(req, res);
            });

            server.listen(currentPort, () => {
                console.log(`Server started on http://localhost:${currentPort}`);
            });

            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.warn(`Port ${currentPort} is in use. Trying port ${currentPort + 1}...`);
                    tryStartServer(currentPort + 1);
                } else {
                    console.error('Server error:', err.message);
                }
            });
        };
        tryStartServer(port);
    }
}
