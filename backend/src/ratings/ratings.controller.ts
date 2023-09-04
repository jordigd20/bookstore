import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RateBookDto } from './dto/rate-book.dto';
import { FindAllBooksEntity } from '../books/entities/find-all-books.entity';
import { FindRatedBooksEntity } from './entities/find-rated-books.entity';
import { RatedBookEntity } from './entities/rated-book.entity';

@ApiTags('ratings')
@Auth()
@ApiBearerAuth()
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @ApiOkResponse({ type: FindRatedBooksEntity })
  @Get(':userId')
  getRatedBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ratingsService.getRatedBooks(userId, paginationDto);
  }

  @ApiOkResponse({ type: FindAllBooksEntity })
  @Get(':userId/not-rated')
  getNotRatedBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ratingsService.getNotRatedBooks(userId, paginationDto);
  }

  @ApiCreatedResponse({ type: RatedBookEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Post(':userId')
  rateBook(@Param('userId', ParseIntPipe) userId: number, @Body() rateBookDto: RateBookDto) {
    return this.ratingsService.rateBook(userId, rateBookDto);
  }
}
