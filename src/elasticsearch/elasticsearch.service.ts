import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(private readonly elasticsearchService: NestElasticsearchService) {}

  async indexDocument(index: string, id: string, document: any) {
    return await this.elasticsearchService.index({
      index,
      id,
      body: document,
    });
  }

  async updateDocument(index: string, id: string, document: any) {
    return await this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: document,  // Using `doc` to update only the specific fields
      },
    });
  }

  async search(index: string, query: any) {
    const body = await this.elasticsearchService.search({
      index,
      body: query,
    });
    return body.hits.hits;
  }
}
