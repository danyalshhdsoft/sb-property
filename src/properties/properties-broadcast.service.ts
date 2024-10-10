import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENTS_MODULE_KAFKA_NAME_PROPERTY,
  KAFKA_PROPERTIES_TOPIC,
} from '../utils/constants/kafka-const';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class PropertiesBroadcastService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE)
    private uploadsClient: ClientKafka,
  ) {}

  async BroadcastFileUpload(files: any) {
    try {
      const fileUploaded = await this.uploadsClient.send(
        KAFKA_PROPERTIES_TOPIC.upload_files,
        files,
      );
      return fileUploaded;
    } catch (oError) {
      throw oError;
    }
  }
}
