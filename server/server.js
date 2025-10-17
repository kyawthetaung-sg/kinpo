import { spawn } from "child_process";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import https from "https";
import http from "http";
import fs from "fs";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoute from "./routes/auth.js";
import adminRoute from "./routes/admin.js";
import authMiddleware from "./middleware/authMiddleware.js";
import Game from "./models/Game.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const isProduction = process.env.NODE_ENV === "production";
let server;

if (isProduction) {
  const sslOptions = {
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/shalkaung.shop-0001/fullchain.pem"
    ),
    key: fs.readFileSync(
      "/etc/letsencrypt/live/shalkaung.shop-0001/privkey.pem"
    ),
  };
  server = https.createServer(sslOptions, app);
  console.log("Running in PRODUCTION mode with HTTPS");
} else {
  server = http.createServer(app);
  console.log("Running in DEVELOPMENT mode with HTTP");
}

app.use(cors());
app.use(express.json());
app.use("/streams", express.static(path.join(__dirname, "streams")));

app.use("/api/admin", authRoute);
app.use("/api/admin", authMiddleware, adminRoute);

const activeStreams = new Map();

function createRTSPStream(gameId, rtspUrl, wsPort) {
  const ffmpegArgs = [
    "-i",
    rtspUrl,
    "-f",
    "mpegts",
    "-codec:v",
    "mpeg1video",
    "-r",
    "25",
    "-s",
    "1280x720",
    "-b:v",
    "1000k",
    "-bf",
    "0",
    "-stats",
    "-",
  ];

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs, {
    stdio: ["ignore", "pipe", "ignore"],
  });

  let wss;

  if (isProduction) {
    wss = new WebSocketServer({
      server: server,
      path: `/ws/${wsPort}`,
    });
  } else {
    wss = new WebSocketServer({ port: wsPort });
  }

  wss.on("connection", (ws) => {
    console.log(`Client connected to game ${gameId}`);

    ws.on("close", () => {
      console.log(`Client disconnected from game ${gameId}`);
    });
  });

  ffmpegProcess.stdout.on("data", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    });
  });

  ffmpegProcess.on("error", (error) => {
    console.error(`FFmpeg error for game ${gameId}:`, error);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg process for game ${gameId} exited with code ${code}`);
    wss.close();
    activeStreams.delete(gameId);
  });

  activeStreams.set(gameId, {
    process: ffmpegProcess,
    wss: wss,
    port: wsPort,
  });

  return wsPort;
}

let games = [];

async function loadGamesFromDB() {
  try {
    games = await Game.find({ active: true });
    console.log(`Loaded ${games.length} games from DB`);
  } catch (err) {
    console.error("Failed to load games:", err);
  }
}

app.post("/api/games/start-all", async (req, res) => {
  try {
    await loadGamesFromDB();

    for (const game of games) {
      if (!activeStreams.has(game.id)) {
        createRTSPStream(game.id, game.url, game.wsPort);
      }
    }

    res.json({ message: "All active games started successfully" });
  } catch (error) {
    console.error("Error starting all games:", error);
    res.status(500).json({ error: "Failed to start all games" });
  }
});

app.post("/api/games/:id/start", (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find((cam) => cam.id === gameId);

  if (!game) {
    return res.status(404).json({ error: "Camera not found" });
  }

  if (activeStreams.has(gameId)) {
    return res.json({
      message: "Stream already running",
      wsPort: activeStreams.get(gameId).port,
    });
  }

  try {
    const wsPort = createRTSPStream(gameId, game.url, game.wsPort);
    res.json({
      message: "Stream started successfully",
      wsPort: wsPort,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to start stream: " + error.message });
  }
});

app.post("/api/games/:id/stop", (req, res) => {
  const gameId = parseInt(req.params.id);
  const stream = activeStreams.get(gameId);

  if (!stream) {
    return res.status(404).json({ error: "Stream not found" });
  }

  try {
    stream.process.kill();
    stream.wss.close();
    activeStreams.delete(gameId);
    res.json({ message: "Stream stopped successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to stop stream" });
  }
});

app.post("/api/games/:id/start-hls", (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = games.find((cam) => cam.id === gameId);

  if (!game) {
    return res.status(404).json({ error: "Camera not found" });
  }

  const outputPath = path.join(__dirname, "streams", `game${gameId}`);

  const ffmpegArgs = [
    "-i",
    game.url,
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "5",
    "-hls_flags",
    "delete_segments",
    "-hls_segment_filename",
    `${outputPath}/segment%03d.ts`,
    `${outputPath}/stream.m3u8`,
  ];

  const ffmpegProcess = spawn("ffmpeg", ffmpegArgs);

  activeStreams.set(gameId, {
    process: ffmpegProcess,
    type: "hls",
    outputPath: outputPath,
  });

  res.json({
    message: "HLS stream started",
    streamUrl: `http://localhost:${PORT}/streams/game${gameId}/stream.m3u8`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
