import fs from "fs";
import http from "http";
import https from "https";
import tls from "tls";
import path from "path";
import express from "express";
import wisp from "wisp-server-node";
import cors from "cors";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pubDir = path.join(__dirname, "public");

const app = express();

app.use(cors());
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

const sslContexts = {
	"study.factwiki.me": tls.createSecureContext({
		key: fs.readFileSync("/etc/letsencrypt/live/study.factwiki.me/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/study.factwiki.me/fullchain.pem")
	}),
	"jupitersnet.miceforlife.com": tls.createSecureContext({
		key: fs.readFileSync("/etc/letsencrypt/live/jupitersnet.miceforlife.com/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/jupitersnet.miceforlife.com/fullchain.pem")
	}),
	"jupiter.bsfa.info": tls.createSecureContext({
		key: fs.readFileSync("/etc/letsencrypt/live/jupiter.bsfa.info/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/jupiter.bsfa.info/fullchain.pem")
	}),
	"jupitersnet.leasingindia.com": tls.createSecureContext({
		key: fs.readFileSync("/etc/letsencrypt/live/jupitersnet.leasingindia.com/privkey.pem"),
		cert: fs.readFileSync("/etc/letsencrypt/live/jupitersnet.leasingindia.com/fullchain.pem")
	})
};

const httpsServer = https.createServer({
	SNICallback: (servername, cb) => {
		if (sslContexts[servername]) cb(null, sslContexts[servername]);
		else cb(new Error("No SSL cert for " + servername));
	}
}, app);

httpServer.on("upgrade", (req, socket, head) => {
	if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
	else socket.end();
});

httpsServer.on("upgrade", (req, socket, head) => {
	if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
	else socket.end();
});

httpServer.listen(80, "0.0.0.0");
httpsServer.listen(443, "0.0.0.0");

console.log(`| JupitersNetworks 1.0 |

Running on:
	http://localhost:80
	https://localhost:443`);
