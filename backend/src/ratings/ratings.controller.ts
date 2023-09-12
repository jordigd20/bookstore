import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
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
import { RateBookDto } from './dto/rate-book.dto';
import { FindAllBooksEntity } from '../books/entities/find-all-books.entity';
import { FindRatedBooksEntity } from './entities/find-rated-books.entity';
import { RatedBookEntity } from './entities/rated-book.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('ratings')
@Auth()
@ApiBearerAuth()
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiOkResponse({ type: FindRatedBooksEntity })
  @ApiForbiddenResponse({ description: 'You can only rate your own books' })
  @Get(':userId')
  getRatedBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ratingsService.getRatedBooks(userId, paginationDto, authUser);
  }

  @ApiOkResponse({ type: FindAllBooksEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':userId/not-rated')
  getNotRatedBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ratingsService.getNotRatedBooks(userId, paginationDto, authUser);
  }

  @ApiCreatedResponse({ type: RatedBookEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post(':userId')
  rateBook(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() rateBookDto: RateBookDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ratingsService.rateBook(userId, rateBookDto, authUser);
  }
}
