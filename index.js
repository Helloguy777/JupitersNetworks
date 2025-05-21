const port = parseInt(process.env.PORT || "80", 10);
const info = {
    "version": "1.0",
};

const startup_msg = `
| JupitersNetworks ${info.version} |

Running on:
    http://localhost:${port} (Internally)
    (Externally accessible via your domain pointing to this server's IP on port ${port})
`;

const http = require("http");
const path = require("path");
const express = require("express");
const wisp = require("wisp-server-node");

const pubDir = path.join(__dirname, "public");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { epoxyPath } = require("@mercuryworkshop/epoxy-transport");
const { libcurlPath } = require("@mercuryworkshop/libcurl-transport");
const { baremuxPath } = require("@mercuryworkshop/bare-mux/node");

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Expose-Headers", "Content-Length, X-Kuma-Revision");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Service-Worker-Allowed", "/");
    next();
});

app.use(express.static(pubDir));

app.get("/uv/uv.config.js", (req, res) => {
    const filePath = path.join(pubDir, "uv", "uv.config.js");
    console.log(`Attempting to serve specific route: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error sending file ${filePath}:`, err);
            res.status(404).end();
        }
    });
});

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res) => {
    console.log(`404 Not Found for: ${req.url}`);
    const notFoundPage = path.join(pubDir, "404.html");
    res.status(404).sendFile(notFoundPage, (err) => {
        if (err) {
            console.error("Error sending 404.html, or it doesn't exist:", err);
            res.status(404).send("Resource not found and 404.html is also missing.");
        }
    });
});

server.on("upgrade", (req, socket, head) => {
    console.log(`Upgrade request for: ${req.url}`);
    if (req.url && req.url.startsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else {
        console.log(`Destroying socket for unhandled upgrade: ${req.url}`);
        socket.destroy();
    }
});

server.listen(port, "0.0.0.0", () => {
    console.log(startup_msg);
    if (port < 1024 && process.getuid && process.getuid() !== 0) {
        console.warn(`\nWARNING: Listening on port ${port} requires root privileges.`);
        console.warn(`Run with 'sudo node index.js' or ensure Node has cap_net_bind_service.`);
    }
    console.log(`Serving static files from: ${pubDir}`);
    console.log(`UV path: ${uvPath}`);
    console.log(`Epoxy path: ${epoxyPath}`);
    console.log(`Libcurl path: ${libcurlPath}`);
    console.log(`BareMux path: ${baremuxPath}`);
});

function gracefulShutdown(signal) {
  console.info(`\n${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
