import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'; // Import Swagger decorators
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/helpers/response.helper';
import { IProduct } from './product.interface';
import { IResponseData } from 'src/interfaces/response.interface';
import { ResponseDto } from 'src/dto/response.dto';
import {
  CreateProductDto,
  ProductIdDto,
  UpdateProductDto,
} from './product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UniqueIdDTO } from 'src/dto/unique_id.dto';
import { PayService } from 'src/pay/pay.service';
import { UserService } from 'src/user/user.service';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('jwt')
@ApiResponse({
  status: HttpStatus.OK,
  type: ResponseDto,
  description: 'Successful response with data',
})
@ApiInternalServerErrorResponse({ description: MESSAGES.INTERNAL_ERROR })
@ApiBadRequestResponse({ description: MESSAGES.BAD_PARAMETERS })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly service: ProductService,
    private readonly payService: PayService,
    private readonly userService: UserService,
  ) {}

  // Create a new product
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' }) // Add an API operation summary
  @ApiBody({ type: CreateProductDto }) // Specify the request body DTO
  async create(
    @Body() body: CreateProductDto,
  ): Promise<IResponseData<IProduct>> {
    const data = await this.service.create(body);

    if (!data) throw new InternalServerErrorException();

    return SuccessResponse(data);
  }

  @Post('pay/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialise a transaction' })
  async pay(
    @Param() param: UniqueIdDTO,
    @Request() req,
  ): Promise<IResponseData<any>> {
    const productData = await this.service.findOne({ _id: param.id });

    if (!productData) throw new NotFoundException('Product not found');

    const userData = await this.userService.findOne({ _id: req.user.sub });

    if (!userData) throw new NotFoundException('User not found');

    const data = await this.payService.initializePayment({
      amount: productData.price * 100,
      email: userData.email,
    });

    if (!data) throw new InternalServerErrorException();

    // console.log(data);

    return SuccessResponse(data);
  }

  // Update an existing product
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiBody({ type: UpdateProductDto }) // Specify the request body DTO
  async update(
    @Param() param: ProductIdDto,
    @Body() body: UpdateProductDto,
  ): Promise<IResponseData<IProduct>> {
    const { id } = param;

    const data = await this.service.update({ _id: id }, body);

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.UPDATED);
  }

  // Soft delete a product
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  async delete(@Param() param: ProductIdDto): Promise<IResponseData<IProduct>> {
    const { id } = param;

    const data = await this.service.softDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }

  // Hard delete a product (for admins only)
  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a product (for admins only)' })
  async hardDelete(
    @Param() param: ProductIdDto,
  ): Promise<IResponseData<IProduct>> {
    const { id } = param;

    const data = await this.service.hardDelete({ _id: id });

    if (!data) throw new NotFoundException();

    return SuccessResponse(data, MESSAGES.DELETED);
  }
}
