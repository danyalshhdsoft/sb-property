import { HttpStatus, Injectable } from '@nestjs/common';
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
      console.log(oError);
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

  async deleteDocument(index: string, id: string) {
    try {
      const result = await this.elasticsearchService.delete({
        index,
        id,
      });
      return {
        status: 200,
        data: {
          message: 'Deleted Succesfully'
        },
      };
    } catch (error) {
      if (error.meta && error.meta.statusCode === 404) {
        return { status: HttpStatus.NOT_FOUND, data: { message: `Document with id ${id} not found in index ${index}` }};
      }
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, data: { message: `Error deleting document` }};
    }
  }

  async searchAutocomplete(query: string, index: string = 'properties') {
    try {
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
    } catch (error) {
      if (error.meta && error.meta.statusCode === 404) {
        return { status: HttpStatus.NOT_FOUND, data: { message: `Index properties not found` }};
      }
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, data: { message: `Internal Server Error` }}
    }
  }
}
