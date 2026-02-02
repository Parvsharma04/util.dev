import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'util.dev-api',
    version: '1.0.0'
  });
});

// API Routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to util.dev API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      clipboard: '/api/clipboard (coming soon)',
      droplink: '/api/droplink (coming soon)'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   util.dev API Server                                 ║
║   ─────────────────────────────────────────────────   ║
║                                                       ║
║   Status:  🟢 Running                                 ║
║   Port:    ${PORT}                                        ║
║   Mode:    ${process.env.NODE_ENV || 'development'}                               ║
║                                                       ║
║   Endpoints:                                          ║
║   • Health: http://localhost:${PORT}/api/health          ║
║   • API:    http://localhost:${PORT}/api                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
