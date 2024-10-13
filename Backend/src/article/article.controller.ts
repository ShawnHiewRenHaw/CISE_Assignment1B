import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll() {
    return this.articleService.findApproved();
  }
  
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get('approved')
  findApproved() {
    return this.articleService.findApproved();
  }

  @Get('rejected')
  findRejected() {
    return this.articleService.findRejected();
  }

  @Get('pending')
  findPending() {
    return this.articleService.findPending();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.articleService.updateStatus(id, status);
  }
}
