export interface ChatMessage {
    senderName: string;
    senderId: string;
    senderRole: string;
    receiverName: string;
    receiverId: string;
    message: string;
    driver: string;
    client: string;
    createdAt: Date;
  }
  