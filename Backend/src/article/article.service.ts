import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.interface'; 
import { SpeedDocument } from './article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel('Speed') private readonly speedModel: Model<SpeedDocument>
  ) {}

  async findAll(): Promise<Article[]> {
      const document = await this.speedModel.findOne().exec();
      return document ? document.articles : [];
  }    

  async findApproved(): Promise<Article[]> {
    const document = await this.speedModel.findOne({ 'articles.status': 'approved' }).exec();

    // Filter only approved articles
    const approvedArticles = document.articles.filter((article: Article) => article.status === 'approved');
    
    return approvedArticles;
  }

  async create(article: Article): Promise<Article> {
    const document = await this.speedModel.findOne().exec();

    document.articles.push({
      title: article.title,
      authors: article.authors,
      source: article.source,
      pubyear: article.pubyear,
      doi: article.doi,
      claim: article.claim,
      evidence: article.evidence,
      status: 'pending', // Ensure status is set to pending
    });

    await document.save();
    return article;
  }
}
