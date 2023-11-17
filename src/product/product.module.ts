import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductPublicController } from './product.public.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { PayModule } from 'src/pay/pay.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PayModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController, ProductPublicController],
  providers: [ProductService],
})
export class ProductModule {}
