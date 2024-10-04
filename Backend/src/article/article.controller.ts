import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Post()
  async create(@Body() article: Article): Promise<Article> {
    return this.articleService.create(article);
  }

  @Put(':id')
  async updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<Article> {
    return this.articleService.updateStatus(id, status);
  }
}
