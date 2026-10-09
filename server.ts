import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // High-performance API endpoints to demonstrate scalable cloud backend simulation
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      region: 'gcp-asia-east1',
      clusterNodes: 12,
      activeConnections: 4820,
      p99LatencyMs: 4.2,
      cacheHitRatio: '99.4%',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/inventory/telemetry', (req, res) => {
    res.json({
      activeNodes: ['us-central1', 'europe-west3', 'asia-east1'],
      totalSkus: 8,
      reservedRatePerMin: 142,
      inventoryStatus: 'HEALTHY'
    });
  });

  // In development, hook into Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEXUS Cloud Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
