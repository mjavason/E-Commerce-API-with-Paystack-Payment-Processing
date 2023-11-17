import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';

@Module({
  providers: [PayService],
  controllers: [PayController],
  exports: [PayService],
})
export class PayModule {}
