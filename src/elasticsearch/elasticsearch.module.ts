import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'https://localhost:9200', // Your Elasticsearch URL windows
      // node: 'http://localhost:9200', // Your Elasticsearch URL linux
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        username: 'elastic',
        password: 'xmiAu67d7V7aVoWud0JD',
      },
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticSearchModule {}
