
const port = parseInt(process.env.PORT || "80", 10);
const info = {
	"version": "1.0",
}

const startup_msg = `
| JupitersNetworks ${info.version} |

Running on:
	http://localhost:${port}
`


const http = require("http");
const { hostname } = require("os");
const path = require("path");
const express = require("express");
const wisp = require("wisp-server-node");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');

const pubDir = path.join(__dirname, "public");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const { epoxyPath } = require("@mercuryworkshop/epoxy-transport");
const { libcurlPath } = require("@mercuryworkshop/libcurl-transport");
const { baremuxPath } = require("@mercuryworkshop/bare-mux/node");

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
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
	res.sendFile(path.join(pubDir, "uv/uv.config.js"));
});

app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res) => {
	res.status(404).sendFile(path.join(pubDir, "404.html"));
});

server.on("upgrade", (req, socket, head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	} else {
		socket.end();
	}
});

server.listen(port, "0.0.0.0", () => {
	const address = server.address();
	console.log(startup_msg)
});
