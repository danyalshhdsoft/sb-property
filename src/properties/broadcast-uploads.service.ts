import { Inject, Injectable } from '@nestjs/common';
import { CLIENTS_MODULE_KAFKA_NAME_PROPERTY } from '../utils/constants/kafka-const';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class BroadcastUploadsService {
  constructor(
    @Inject(CLIENTS_MODULE_KAFKA_NAME_PROPERTY.UPLOADS_SERVICE)
    private uploadsClient: ClientKafka,
  ) {}

  async BroadcastFileUpload(files: any, topic: string, folder: string) {
    try {
      const fileUploaded = await this.uploadsClient
        .send(topic, { files, folder: folder })
        .toPromise();
      return fileUploaded;
    } catch (oError) {
      throw oError;
    }
  }
}
