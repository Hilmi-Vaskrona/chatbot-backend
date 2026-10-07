import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Groq from 'groq-sdk';

@Injectable()
export class ChatService implements OnModuleInit {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

    this.groq = new Groq({ apiKey });
  }

  // Fungsi ini akan otomatis berjalan saat NestJS pertama kali hidup
  async onModuleInit() {
    try {
      console.log('🔄 Memeriksa model Groq yang tersedia...');
      const models = await this.groq.models.list();
      console.log('✅ Model yang bisa Anda gunakan:');

      // Mencetak ID model ke terminal
      models.data.forEach((model) => {
        console.log(`- ${model.id}`);
      });
    } catch (error) {
      console.error('❌ Gagal mengambil daftar model:', error.message);
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const modelName = this.configService.get<string>('GROQ_MODEL', 'qwen/qwen3.8-27b');

      // Tambah timeout 30 detik agar tidak loading selamanya
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: modelName,
      }, {
         signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return chatCompletion.choices[0]?.message?.content || 'Tidak ada respons';
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout: AI tidak merespon dalam 30 detik');
      }
      console.error('Groq AI Error:', error);
      throw new Error('Gagal mendapatkan respon dari AI Groq');
    }
  }
}