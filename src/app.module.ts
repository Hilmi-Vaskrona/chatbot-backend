import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { ConfigModule } from 'node_modules/@nestjs/config/dist/config.module';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService],
})
export class AppModule {}
