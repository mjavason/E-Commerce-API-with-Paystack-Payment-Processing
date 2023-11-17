import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { PayService } from './pay.service';
import {
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IResponseData } from 'src/interfaces/response.interface';
import { InitializePaymentDTO } from './pay.dto';
import { MESSAGES } from '../constants';
import { ResponseDto } from 'src/dto/response.dto';

@Controller('pay')
@ApiTags('Payment')
@ApiBearerAuth('jwt')
@ApiResponse({
  status: HttpStatus.OK,
  type: ResponseDto,
  description: 'Successful response with data',
})
@ApiInternalServerErrorResponse({ description: MESSAGES.INTERNAL_ERROR })
@ApiBadRequestResponse({ description: MESSAGES.BAD_PARAMETERS })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// @UseGuards(JwtAuthGuard)
export class PayController {
  constructor(private readonly service: PayService) {}

  @Post('test-initialize')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialise a transaction' })
  @ApiBody({ type: InitializePaymentDTO })
  async create(
    @Body() body: InitializePaymentDTO,
  ): Promise<IResponseData<any>> {
    const data = await this.service.initializePayment(body);

    if (!data) throw new InternalServerErrorException();

    // console.log(data);

    return SuccessResponse(data);
  }
}
