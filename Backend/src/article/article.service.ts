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
    try {
      const document = await this.speedModel.findOne().exec();
      console.log('Document fetched:', document); // Log the fetched document
      return document ? document.articles : [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Database error');
    }
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
      status: article.status || 'pending',
    });
    await document.save();
    return article;
  }
  
  async updateStatus(id: string, status: string): Promise<Article> {
    const document = await this.speedModel.findOne().exec();
  
    const article = document.articles.find((a: Article) => a._id.toString() === id); 
  
    if (article) {
      article.status = status;
      await document.save(); 
    }
  
    return article;
  }  
}
