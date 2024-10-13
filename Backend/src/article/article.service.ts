import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleDocument } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Article') private readonly articleModel: Model<ArticleDocument>
  ) {}

  // Create a new article submission
  async create(createArticleDto: CreateArticleDto): Promise<ArticleDocument> {
    console.log('Creating new article with data:', createArticleDto);
    const newArticle = new this.articleModel(createArticleDto);
    return newArticle.save();
  }  

  // Get all approved articles
  async findApproved(): Promise<ArticleDocument[]> {
    return this.articleModel.find({ status: 'approved' }).exec();
  }

  // Get all rejected articles
  async findRejected(): Promise<ArticleDocument[]> {
    return this.articleModel.find({ status: 'rejected' }).exec();
  }

  // Get all pending articles
  async findPending(): Promise<ArticleDocument[]> {
    return this.articleModel.find({ status: 'pending' }).exec();
  }

  // Approve or reject an article
  async updateStatus(id: string, status: string): Promise<ArticleDocument> {
    const document = await this.articleModel.findById(id).exec();
    if (!document) throw new Error('Article not found');

    document.status = status;
    await document.save();
    return document;
  }
}