import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [];
  clientToUser = {};

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const date = new Date();

    const message = {
      id: uuid(),
      client_name: this.clientToUser[clientId],
      client_id: clientId,
      text: createMessageDto.text,
      date: `
        ${String(date.getHours()).padStart(2, '0')}:
        ${String(date.getMinutes()).padStart(2, '0')}
      `,
    };

    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  deleteMessage(id: string, clientId: string) {
    const message = this.messages.find((message) => message.id === id);

    if (message.client_id === clientId) {
      this.messages = this.messages.filter((message) => message.id !== id);
    }

    return this.messages;
  }
}
