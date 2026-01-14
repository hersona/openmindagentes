import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper function to read config
function getConfig() {
  try {
    const configPath = join(__dirname, '..', 'agents.config.json');
    const configData = readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error reading config:', error);
    throw error;
  }
}

// GET /api/agents - Returns list of all agents
app.get('/api/agents', (req, res) => {
  try {
    const config = getConfig();
    res.json({
      agents: config.agents,
      company_info: config.company_info
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load agents configuration' });
  }
});

// POST /api/agent/:id/execute - Execute an agent
app.post('/api/agent/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    // Read config
    const config = getConfig();
    const agent = config.agents.find(a => a.id === id);

    if (!agent) {
      return res.status(404).json({ error: `Agent with id '${id}' not found` });
    }

    // Forward request to n8n webhook
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    try {
      const response = await fetch(agent.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `n8n webhook returned status ${response.status}` 
        });
      }

      const result = await response.json();
      res.json(result);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ error: 'Request timeout (30s)' });
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Error executing agent:', error);
    res.status(500).json({ error: 'Failed to execute agent' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
