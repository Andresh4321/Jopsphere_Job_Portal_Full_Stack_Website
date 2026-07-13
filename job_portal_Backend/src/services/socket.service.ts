import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Auth/auth.type";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }, // tighten this to your frontend origin in production
  });

  // Auth middleware: client connects with `io(url, { auth: { token } })`
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Missing auth token"));
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Client asks to join a specific offer's negotiation room. Authorization
    // (is this user actually part of this offer?) is checked in the offer
    // service before this event even fires from the client — the client
    // only receives an offerId it's already allowed to see via the REST API.
    socket.on("join_offer", (offerId: string) => {
      socket.join(`offer:${offerId}`);
    });

    socket.on("leave_offer", (offerId: string) => {
      socket.leave(`offer:${offerId}`);
    });
  });

  return io;
};

// Broadcast helpers — called from offer.service.ts after a REST mutation succeeds.
export const emitToOffer = (offerId: string, event: string, payload: unknown) => {
  if (!io) return; // socket server not initialized (e.g. in tests) — no-op
  io.to(`offer:${offerId}`).emit(event, payload);
};