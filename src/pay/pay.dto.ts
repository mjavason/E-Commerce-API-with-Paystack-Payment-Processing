import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class InitializePaymentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
