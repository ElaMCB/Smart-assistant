export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  recipientEmail?: string;
}

export interface NotificationRecipient {
  email: string;
  role: 'approver' | 'submitter' | 'viewer';
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendNotification(message: string, type: Notification['type'], recipients: NotificationRecipient[]) {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    // In a real application, you would integrate with an email service or push notification system
    recipients.forEach(recipient => {
      console.log(`Sending notification to ${recipient.email}: ${message}`);
    });

    this.notifications.push(notification);
    return notification;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notifications;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

export default NotificationService; 