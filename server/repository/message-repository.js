export default class MessageRepository {
  constructor(Message) {
    this.model = Message;
  }

  async saveUserMessage(userId, content) {
    return this.model.create({ userId, role: "user", content });
  }

  async saveAssistantMessage(userId, content) {
    return this.model.create({ userId, role: "assistant", content });
  }

  async getConversationHistory(userId, limit = 20) {
    const raw = await this.model
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return raw.reverse().map((m) => ({
      id: m._id.toString(),
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    }));
  }

  async countUserMessagesSince(userId, sinceDate) {
    return this.model.countDocuments({
      userId,
      role: "user",
      createdAt: { $gte: sinceDate },
    });
  }

  async getMessageById(userId, messageId) {
    return this.model.findOne({ _id: messageId, userId }).lean();
  }
}
