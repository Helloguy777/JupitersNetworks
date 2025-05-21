const fs = require("fs");
const http = require("http");
const https = require("https");
const { hostname } = require("os");
const path = require("path");
const express = require("express");
const wisp = require("wisp-server-node");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const pubDir = path.join(__dirname, "public");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { epoxyPath } = require("@mercuryworkshop/epoxy-transport");
const { libcurlPath } = require("@mercuryworkshop/libcurl-transport");
const { baremuxPath } = require("@mercuryworkshop/bare-mux/node");

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.setHeader("Access-Control-Expose-Headers", "Content-Length, X-Kuma-Revision");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Service-Worker-Allowed", "/");
	next();
});

app.use(express.static(pubDir));

app.get("/uv/uv.config.js", (req, res) => {
	res.sendFile(path.join(pubDir, "uv/uv.config.js"));
});

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res) => {
	res.status(404).sendFile(path.join(pubDir, "404.html"));
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
	key: fs.readFileSync("key.pem"),
	cert: fs.readFileSync("cert.pem")
}, app);

httpServer.on("upgrade", (req, socket, head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	} else {
		socket.end();
	}
});

httpsServer.on("upgrade", (req, socket, head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	} else {
		socket.end();
	}
});

httpServer.listen(80, "0.0.0.0");
httpsServer.listen(443, "0.0.0.0");

console.log(`
| JupitersNetworks 1.0 |

Running on:
	http://localhost:80
	https://localhost:443
`);
