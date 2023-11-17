import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DB_CONNECTION_STRING } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ActivityModule } from './activity/activity.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_CONNECTION_STRING),
    ProductModule,
    UserModule,
    AuthModule,
    ActivityModule,
    PayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
