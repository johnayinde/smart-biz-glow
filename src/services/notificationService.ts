import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: Date;
  metadata?: any;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${API_URL}/notifications`, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    this.socket.on("notification", (notification: Notification) => {
      this.emit("new-notification", notification);
    });

    this.socket.on("unreadCount", (count: number) => {
      this.emit("unread-count", count);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  async getAll(limit = 50): Promise<Notification[]> {
    const { data } = await axios.get(`${API_URL}/notifications?limit=${limit}`);
    return data;
  }

  async getUnreadCount(): Promise<number> {
    const { data } = await axios.get(`${API_URL}/notifications/unread-count`);
    return data.count;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await axios.patch(`${API_URL}/notifications/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`${API_URL}/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService();
