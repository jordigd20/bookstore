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
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AddressEntity } from './entities/address.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@ApiTags('addresses')
@Auth()
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @ApiCreatedResponse({ type: AddressEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post(':userId')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.addressesService.create(userId, createAddressDto, authUser);
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Auth('jwt', ValidRoles.admin)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.addressesService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number, @GetUser() authUser: AuthUser) {
    return this.addressesService.findOne(userId, authUser);
  }

  @ApiOkResponse({ type: AddressEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.addressesService.update(id, updateAddressDto, authUser);
  }

  @ApiOkResponse({ description: 'Address deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() authUser: AuthUser) {
    return this.addressesService.remove(id, authUser);
  }
}
