import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(
    private readonly elasticsearchService: NestElasticsearchService,
  ) {}

  async indexDocument(index: string, id: string, document: any) {
    try {
      return await this.elasticsearchService.index({
        index,
        id,
        body: document,
      });
    } catch (oError) {
      throw oError;
    }
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

  async search(query: any, from: number, size: number = 10, index: string = 'properties') {
    const body = await this.elasticsearchService.search({
      index,
      body: query,
      size,
      from
    });
    return body.hits.hits;
  }

  async searchAutocomplete(query: string, index: string = 'properties') {
    const body = await this.elasticsearchService.search({
      index,
      body: {
        query: {
          multi_match: {
            query,
            type: "phrase_prefix",
            fields: ["area", "building"],
            slop: 1
          }
        },
        size: 10, // Limit results for autocomplete
      },
    });
    return { status: 200, data: body.hits.hits.map(hit => hit._source) }
  }
}
