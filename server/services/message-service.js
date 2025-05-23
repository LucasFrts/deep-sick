export default class MessageService {
  constructor({ messageRepository, sdk }) {
    this.messageRepository = messageRepository;
    this.sdk = sdk;
  }

  async processMessage(userId, userContent) {
    await this.messageRepository.saveUserMessage(userId, userContent);

    const history = await this.messageRepository.getConversationHistory(userId);

    const messages = history
      .map((m) => ({ role: m.role, content: m.content }))
      .reverse();

    const aiResponse = await this.sdk.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Voce e um assistente de chatbot, responda apenas com o que foi pedido.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: "deepseek-chat",
    });
    console.log(aiResponse, aiResponse.choices[0].message, "aiReponse");
    const repply = aiResponse.choices[0].message.content;
    console.log(repply, "repplyxs");
    await this.messageRepository.saveAssistantMessage(userId, repply);

    return { repply, messages };
  }

  async getConversationHistory(userId) {
    return this.messageRepository.getConversationHistory(userId);
  }

  async getMessageById(userId, messageId) {
    return this.messageRepository.getMessageById(userId, messageId);
  }
}
