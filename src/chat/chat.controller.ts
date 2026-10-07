import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    // Kita ubah 'prompt' menjadi 'messages' yang berupa array
    @Body('messages') messages: { role: string; content: string }[]
  ) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        success: false,
        message: 'Body request harus berisi properti "messages" berupa array non-kosong.',
      };
    }

    const prompt = messages
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    // Teruskan prompt yang sudah dibentuk menjadi string ke service
    const reply = await this.chatService.generateResponse(prompt);
    return {
      success: true,
      data: reply,
    };
  }
}