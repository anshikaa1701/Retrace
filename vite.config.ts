import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleAiChatRequest } from './src/server/aiChatMiddleware.js'
// @ts-ignore
import { handleDeviceApiRequest } from './src/server/deviceDatabaseMiddleware.js'

function repathAiBackendPlugin(): Plugin {
  return {
    name: 'repath-ai-backend',
    configureServer(server) {
      server.middlewares.use('/api/ai/chat', (req, res) => {
        handleAiChatRequest(req, res);
      });
      server.middlewares.use('/api/devices', (req, res) => {
        handleDeviceApiRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai/chat', (req, res) => {
        handleAiChatRequest(req, res);
      });
      server.middlewares.use('/api/devices', (req, res) => {
        handleDeviceApiRequest(req, res);
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), repathAiBackendPlugin()],
})
