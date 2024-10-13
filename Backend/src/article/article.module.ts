import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeedSchema } from './article.schema';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Speed', schema: SpeedSchema }]), 
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
