import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.interface';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get('approved')
  async findApproved(): Promise<Article[]> {
    return this.articleService.findApproved();
  }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('evidence') evidence: string 
  ): Promise<Article> {
    return this.articleService.updateStatus(id, status, evidence); 
  }
}
