import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectsSchema } from './schemas/projects.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { LocationsModule } from '../locations/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
    ]),
    LocationsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
