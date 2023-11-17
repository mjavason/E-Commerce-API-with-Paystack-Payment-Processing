import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsObjectIdOrHexString } from 'src/decorators/is_object_id.decorator';

export class UniqueIdDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsObjectIdOrHexString()
  id: string;
}
