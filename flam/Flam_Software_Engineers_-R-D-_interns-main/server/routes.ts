import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { frameMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time frame streaming
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket client connected");
    clients.add(ws);

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const parsed = frameMessageSchema.safeParse(message);

        if (parsed.success) {
          // Broadcast frame to all other clients
          clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(parsed.data));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  // API endpoint to get server statistics
  app.get("/api/stats", (req, res) => {
    res.json({
      connectedClients: clients.size,
      timestamp: Date.now(),
    });
  });

  // API endpoint to save processed frame (base64)
  app.post("/api/frames/save", (req, res) => {
    const { data, filename } = req.body;
    
    if (!data || !filename) {
      return res.status(400).json({ error: "Missing data or filename" });
    }

    // In a real implementation, this would save to disk or cloud storage
    // For this demo, we just acknowledge receipt
    res.json({ 
      success: true, 
      filename,
      timestamp: Date.now(),
      message: "Frame data received (demo mode - not actually saved to disk)"
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok",
      timestamp: Date.now(),
      service: "computer-vision-backend"
    });
  });

  return httpServer;
}
