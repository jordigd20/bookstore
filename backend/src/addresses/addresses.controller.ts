import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AddressEntity } from './entities/address.entity';

@ApiTags('addresses')
@Auth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiCreatedResponse({ type: AddressEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiBearerAuth()
  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createAddressDto: CreateAddressDto
  ) {
    return this.addressesService.create(userId, createAddressDto);
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @ApiBearerAuth()
  @Get('')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.addressesService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @ApiBearerAuth()
  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.addressesService.findOne(userId);
  }

  @ApiOkResponse({ type: AddressEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @ApiOkResponse({ description: 'Address deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(id);
  }
}
