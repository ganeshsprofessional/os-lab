// SessionManager.js
import { UserSession } from "./UserSession.js";

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(userId, imageName, volumeName, ws, challenges) {
    if (this.sessions.has(userId)) {
      // Handle existing session - maybe disconnect old one?
      const oldSession = this.sessions.get(userId);
      oldSession.ws.close();
      oldSession.destroy();
    }
    const session = new UserSession(
      userId,
      imageName,
      volumeName,
      ws,
      challenges
    );
    this.sessions.set(userId, session);
    session.initialize();
    return session;
  }

  getSession(userId) {
    return this.sessions.get(userId);
  }

  removeSession(userId) {
    const session = this.sessions.get(userId);
    if (session) {
      session.destroy();
      this.sessions.delete(userId);
    }
  }
}

// Export a singleton instance
export const sessionManager = new SessionManager();
