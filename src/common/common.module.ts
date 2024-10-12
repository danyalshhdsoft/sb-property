import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Documents, DocumentsSchema } from './schemas/documents.schema';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_CONSUMER_GROUP_ID,
  KAFKA_OPTIONS_CLIENT_ID,
} from '../utils/constants/kafka-const';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: CLIENTS_MODULE_KAFKA_NAME_PROPERTY.AUTH_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_OPTIONS_CLIENT_ID.auth,
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: KAFKA_CONSUMER_GROUP_ID.auth_consumer,
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: Documents.name, schema: DocumentsSchema },
    ]),
  ],
  exports: [ClientsModule],
})
export class CommonModule {}
