import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Req,
  Delete
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTags('users')
@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiBearerAuth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Get(':term')
  findOne(
    @Param('term') term: string,
    @Query()
    findOneDto: FindOneUserDto
  ) {
    return this.usersService.findOne(term, findOneDto);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get(':id/wishlist')
  getWishlist(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getWishlist(id);
  }

  @Post(':id/wishlist/:bookIds')
  addToWishlist(@Param('id', ParseIntPipe) id: number, @Param('bookIds') booksIds: string) {
    return this.usersService.addToWishlist(id, booksIds);
  }

  @Delete(':id/wishlist/:bookIds')
  removeFromWishlist(@Param('id', ParseIntPipe) id: number, @Param('bookIds') booksIds: string) {
    return this.usersService.removeFromWishlist(id, booksIds);
  }
}
