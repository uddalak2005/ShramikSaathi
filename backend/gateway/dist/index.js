import { createProxyMiddleware } from "http-proxy-middleware";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors({
    origin: "*",
}));
const PORT = process.env.PORT || 3000;
// app.use("/auth", createProxyMiddleware({
//     target: "http://localhost:3001",
//     changeOrigin: true,
//     logger: console,
// }));
// app.use("/mandi", createProxyMiddleware({
//     target: "http://localhost:3002",
//     changeOrigin: true,
//     logger: console,
// }));
// app.use("/community", createProxyMiddleware({
//     target: "http://localhost:3004",
//     changeOrigin: true,
//     logger: console,
// }));
// app.use("/notification", createProxyMiddleware({
//     target: "http://localhost:3003",
//     changeOrigin: true,
//     logger: console,
// }))
app.use("/auth", createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
    logger: console,
}));
app.use("/mandi", createProxyMiddleware({
    target: "http://mandi-service:3002",
    changeOrigin: true,
    logger: console,
}));
app.use("/community", createProxyMiddleware({
    target: "http://community-service:3004",
    changeOrigin: true,
    logger: console,
}));
app.use("/notification", createProxyMiddleware({
    target: "http://notification-service:3003",
    changeOrigin: true,
    logger: console,
}))
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is listening on port: ${PORT}`);
});
