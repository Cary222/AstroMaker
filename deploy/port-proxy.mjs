#!/usr/bin/env node
/**
 * 外放端口 → 本机生产端口（Next 仅监听 127.0.0.1:PROD_PORT）
 * 环境变量：PROD_HOST、PROD_PORT、EXTERNAL_HOST、EXTERNAL_PORT
 */
import http from "node:http";

const PROD_HOST = process.env.PROD_HOST || "127.0.0.1";
const PROD_PORT = Number(process.env.PROD_PORT || 3001);
const EXTERNAL_HOST = process.env.EXTERNAL_HOST || "0.0.0.0";
const EXTERNAL_PORT = Number(process.env.EXTERNAL_PORT || 3000);

const server = http.createServer((clientReq, clientRes) => {
  const proxyReq = http.request(
    {
      hostname: PROD_HOST,
      port: PROD_PORT,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers,
    },
    (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(clientRes);
    }
  );

  proxyReq.on("error", (err) => {
    console.error("proxy error:", err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      clientRes.end("Bad Gateway");
    }
  });

  clientReq.pipe(proxyReq);
});

server.listen(EXTERNAL_PORT, EXTERNAL_HOST, () => {
  console.log(
    `community-proxy listening ${EXTERNAL_HOST}:${EXTERNAL_PORT} -> ${PROD_HOST}:${PROD_PORT}`
  );
});
