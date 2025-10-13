import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/streams', express.static(path.join(__dirname, 'streams')));

const cameras = [
  {
    id: 1,
    category: 1,
    code: 'G20',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/0',
    wsPort: 9999,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  },
  {
    id: 2,
    category: 1,
    code: 'N8',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/0',
    wsPort: 9998,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  },
  {
    id: 3,
    category: 1,
    code: 'G05',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/1',
    wsPort: 9997,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  },
  {
    id: 4,
    category: 2,
    code: 'G06',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/0',
    wsPort: 9994,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  },
  {
    id: 5,
    category: 2,
    code: 'G12',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/0',
    wsPort: 9996,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  },
  {
    id: 6,
    category: 3,
    code: 'G13',
    name: '开牌',
    url: 'rtsp://103.144.9.10:554/0',
    wsPort: 9995,
    active: false,
    banker: 17,
    player: 19,
    tie: 5,
    total: 41,
  }
];

const activeStreams = new Map();

function createRTSPStream(cameraId, rtspUrl, wsPort) {
  const ffmpegArgs = [
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-r', '25',
    '-s', '1280x720',
    '-b:v', '1000k',
    '-bf', '0',
    '-stats',
    '-'
  ];

  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
    stdio: ['ignore', 'pipe', 'ignore']
  });

  const wss = new WebSocketServer({ port: wsPort });

  wss.on('connection', (ws) => {
    console.log(`Client connected to camera ${cameraId}`);

    ws.on('close', () => {
      console.log(`Client disconnected from camera ${cameraId}`);
    });
  });

  ffmpegProcess.stdout.on('data', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    });
  });

  ffmpegProcess.on('error', (error) => {
    console.error(`FFmpeg error for camera ${cameraId}:`, error);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process for camera ${cameraId} exited with code ${code}`);
    wss.close();
    activeStreams.delete(cameraId);
  });

  activeStreams.set(cameraId, {
    process: ffmpegProcess,
    wss: wss,
    port: wsPort
  });

  return wsPort;
}

// API Routes
app.get('/api/cameras', (req, res) => {
  res.json(cameras.map(cam => ({
    ...cam,
    active: activeStreams.has(cam.id)
  })));
});

app.post('/api/cameras/:id/start', (req, res) => {
  const cameraId = parseInt(req.params.id);
  const camera = cameras.find(cam => cam.id === cameraId);

  if (!camera) {
    return res.status(404).json({ error: 'Camera not found' });
  }

  if (activeStreams.has(cameraId)) {
    return res.json({
      message: 'Stream already running',
      wsPort: activeStreams.get(cameraId).port
    });
  }

  try {
    const wsPort = createRTSPStream(cameraId, camera.url, camera.wsPort);
    res.json({
      message: 'Stream started successfully',
      wsPort: wsPort
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start stream: ' + error.message });
  }
});

app.post('/api/cameras/:id/stop', (req, res) => {
  const cameraId = parseInt(req.params.id);
  const stream = activeStreams.get(cameraId);

  if (!stream) {
    return res.status(404).json({ error: 'Stream not found' });
  }

  try {
    stream.process.kill();
    stream.wss.close();
    activeStreams.delete(cameraId);
    res.json({ message: 'Stream stopped successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop stream' });
  }
});

app.post('/api/cameras/:id/start-hls', (req, res) => {
  const cameraId = parseInt(req.params.id);
  const camera = cameras.find(cam => cam.id === cameraId);

  if (!camera) {
    return res.status(404).json({ error: 'Camera not found' });
  }

  const outputPath = path.join(__dirname, 'streams', `camera${cameraId}`);

  const ffmpegArgs = [
    '-i', camera.url,
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '5',
    '-hls_flags', 'delete_segments',
    '-hls_segment_filename', `${outputPath}/segment%03d.ts`,
    `${outputPath}/stream.m3u8`
  ];

  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

  activeStreams.set(cameraId, {
    process: ffmpegProcess,
    type: 'hls',
    outputPath: outputPath
  });

  res.json({
    message: 'HLS stream started',
    streamUrl: `http://localhost:${PORT}/streams/camera${cameraId}/stream.m3u8`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  cameras.forEach(camera => {
    try {
      console.log(`Starting stream for ${camera.name}...`);
      createRTSPStream(camera.id, camera.url, camera.wsPort);
    } catch (err) {
      console.error(`Failed to start ${camera.name}:`, err);
    }
  });
});