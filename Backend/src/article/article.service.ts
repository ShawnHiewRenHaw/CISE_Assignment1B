import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.interface'; 
import { CreateArticleDto } from './dto/create-article.dto'; // Adjust the path as necessary


@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Speed') private readonly articleModel: Model<Article>
  ) {}

  

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec(); 
  }    

  async findApproved(): Promise<Article[]> {
    return this.articleModel.find({ status: 'approved' }).exec(); 
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const lastArticle = await this.articleModel.findOne().sort({ id: -1 }).exec();
    const newId = lastArticle ? (parseInt(lastArticle.id) + 1).toString() : "1";
  
    const newArticle = new this.articleModel({
      ...createArticleDto, // Make sure this includes research and participant
      id: newId,
      status: 'pending', // Default status
    });
  
    return newArticle.save(); 
  }

  

  async updateStatus(id: string, status: string, evidence: string, research: string, participant: string): Promise<Article | null> {
    const article = await this.articleModel.findById(id).exec(); 

    if (article) {
      article.status = status; 
      article.evidence = evidence; 
      await article.save(); 
      return article;
    }

    return null; 
  }
}
