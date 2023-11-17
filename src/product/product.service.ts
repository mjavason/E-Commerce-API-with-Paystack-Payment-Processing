import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from './product.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<IProduct>,
  ) {}

  async create(body: object) {
    return await this.model.create(body);
  }

  async getAll(pagination: number) {
    return await this.model
      .find({ deleted: false })
      .limit(10)
      .skip(pagination)
      .sort({ createdAt: 'desc' })
      .select('-__v');
  }

  async update(searchDetails: object, update: object) {
    return await this.model
      .findOneAndUpdate({ ...searchDetails, deleted: false }, update, {
        new: true,
      })
      .select('-__v');
  }

  async getCount(searchData: object) {
    return await this.model.countDocuments({ ...searchData, deleted: false });
  }

  async find(searchData: object) {
    return await this.model
      .find({ ...searchData, deleted: false })
      .select('-__v');
  }

  async findOne(searchData: object) {
    return this.model.findOne({ ...searchData, deleted: false }).select('-__v');
  }

  async softDelete(searchParams: object) {
    return await this.model
      .findOneAndUpdate(
        { ...searchParams, deleted: false },
        { deleted: true },
        {
          new: true,
        },
      )
      .select('-__v');
  }

  async hardDelete(searchParams: object) {
    return await this.model.findOneAndDelete(searchParams).select('-__v');
  }

  async exists(searchParams: object) {
    return await this.model.exists(searchParams);
  }
}
