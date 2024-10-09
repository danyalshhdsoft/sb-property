import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevelopersModule } from './developers/developers.module';
import { ProjectsModule } from './projects/projects.module';
import { LocationsModule } from './locations/location.module';
import { PropertiesModule } from './properties/properties.module';
import { CommonModule } from './common/common.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_CONSUMER_GROUP_ID,
  KAFKA_OPTIONS_CLIENT_ID,
} from './utils/constants/kafka-const';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('Successfully connected to the database');
          });
          connection.on('error', (err) => {
            console.error('Database connection error:', err);
          });
          return connection;
        },
      }),
    }),
    ClientsModule.register([
      {
        name: CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KAFKA_OPTIONS_CLIENT_ID.uploads_service,
            //brokers: ['host.docker.internal:9092'],
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: KAFKA_CONSUMER_GROUP_ID.uploads_consumer,
          },
        },
      },
    ]),
    CommonModule,
    DevelopersModule,
    ProjectsModule,
    LocationsModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
