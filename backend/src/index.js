import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const COMFYUI_URL = process.env.COMFYUI_URL || 'http://127.0.0.1:8188';

app.use(cors());
app.use(express.json());

// User preferences file
const PREFERENCES_FILE = path.join(__dirname, '../../user-preferences.json');
const WORKFLOWS_DIR = path.join(__dirname, '../../workflows');

// Ensure workflows directory exists
await fs.mkdir(WORKFLOWS_DIR, { recursive: true });

// Get user preferences
app.get('/api/preferences', async (req, res) => {
  try {
    const data = await fs.readFile(PREFERENCES_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultPreferences = {
        customNodes: [],
        theme: 'dark',
        comfyuiUrl: COMFYUI_URL
      };
      res.json(defaultPreferences);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Save user preferences
app.post('/api/preferences', async (req, res) => {
  try {
    await fs.writeFile(PREFERENCES_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy to ComfyUI API
app.use('/api/comfy', async (req, res) => {
  try {
    const comfyPath = req.url.replace('/comfy', '');
    const url = `${COMFYUI_URL}${comfyPath}`;

    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('ComfyUI proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// List workflows
app.get('/api/workflows', async (req, res) => {
  try {
    const files = await fs.readdir(WORKFLOWS_DIR);
    const workflows = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(WORKFLOWS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        workflows.push({
          id: file.replace('.json', ''),
          name: data.name || file.replace('.json', ''),
          created: (await fs.stat(filePath)).birthtime,
        });
      }
    }

    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const filePath = path.join(WORKFLOWS_DIR, `${req.params.id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    res.status(404).json({ error: 'Workflow not found' });
  }
});

// Save workflow
app.post('/api/workflows', async (req, res) => {
  try {
    const { id, name, workflow } = req.body;
    const fileName = `${id || Date.now()}.json`;
    const filePath = path.join(WORKFLOWS_DIR, fileName);

    await fs.writeFile(filePath, JSON.stringify({ name, workflow }, null, 2));
    res.json({ success: true, id: fileName.replace('.json', '') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workflow
app.delete('/api/workflows/:id', async (req, res) => {
  try {
    const filePath = path.join(WORKFLOWS_DIR, `${req.params.id}.json`);
    await fs.unlink(filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = http.createServer(app);

// WebSocket proxy for ComfyUI
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');

  // Connect to ComfyUI WebSocket
  const comfyWs = new WebSocket(COMFYUI_URL.replace('http', 'ws') + '/ws');

  comfyWs.on('open', () => {
    console.log('Connected to ComfyUI WebSocket');
  });

  comfyWs.on('message', (data) => {
    ws.send(data);
  });

  ws.on('message', (data) => {
    if (comfyWs.readyState === WebSocket.OPEN) {
      comfyWs.send(data);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    comfyWs.close();
  });

  comfyWs.on('close', () => {
    console.log('ComfyUI WebSocket closed');
    ws.close();
  });
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Proxying to ComfyUI at ${COMFYUI_URL}`);
});
