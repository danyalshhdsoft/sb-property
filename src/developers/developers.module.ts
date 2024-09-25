import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Developers, DevelopersSchema } from './schemas/developers.schema';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Developers.name, schema: DevelopersSchema },
    ]),
  ],
  controllers: [DevelopersController],
  providers: [DevelopersService],
})
export class DevelopersModule {}
