import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Document } from 'mongoose';
import { Hotel } from '../schemas/hotel.schema';

@Injectable()
export class HotelService {
  constructor(@InjectModel('Hotel') private readonly model: Model<Hotel>) {}

  private async executeQuery<T extends Document | Document[]>(
    query: Promise<T | null>
  ): Promise<T extends Document[] ? Hotel[] : Hotel> {
    const result = await query;
    if (!result) {
      throw new NotFoundException('Hotel not found');
    }
    if (Array.isArray(result)) {
      return result.map(doc => doc.toObject()) as any;
    }
    return result.toObject() as any;
  }

  async createOne(data: Partial<Omit<Hotel, '_id'>>): Promise<Hotel> {
    return this.executeQuery(new this.model(data).save());
  }

  async findOneById(id: string): Promise<Hotel> {
    return this.executeQuery(this.model.findById(id).select('-__v').exec());
  }

  async findAll(filter: FilterQuery<Hotel> = {}): Promise<Hotel[]> {
    return this.executeQuery(
      this.model.find(filter).select('-__v').sort({ createdAt: -1 }).exec()
    );
  }

  async updateOneById(
    id: string,
    data: Partial<Omit<Hotel, '_id'>>,
    options: { upsert?: boolean } = {}
  ): Promise<Hotel> {
    return this.executeQuery(
      this.model
        .findByIdAndUpdate(id, { $set: data }, { new: true, ...options })
        .select('-__v')
        .exec()
    );
  }

  async deleteOneById(id: string): Promise<Hotel> {
    return this.executeQuery(
      this.model.findByIdAndDelete(id).select('-__v').exec()
    );
  }

  async findByLocation(city: string, country: string): Promise<Hotel[]> {
    return this.findAll({
      'location.city': new RegExp(city, 'i'),
      'location.country': new RegExp(country, 'i'),
    });
  }

  async findByRating(minRating: number): Promise<Hotel[]> {
    return this.findAll({ rating: { $gte: minRating } });
  }

  async exists(id: string): Promise<boolean> {
    return (await this.model.exists({ _id: id })) !== null;
  }
}