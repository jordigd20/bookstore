import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { SearchBookDto } from './dto/search-book.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BookEntity } from './entities/book.entity';
import { CategoryEntity } from './entities/category.entity';
import { FindAllBooksEntity } from './entities/find-all-books.entity';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@ApiTags('books')
@Auth()
@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiCreatedResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @ApiOkResponse({ type: FindAllBooksEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get()
  findAll(@Query() searchBookDto: SearchBookDto) {
    return this.booksService.findAll(searchBookDto);
  }

  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  @Get('categories')
  findAllCategories(@Query() getCategoriesDto: GetCategoriesDto) {
    return this.booksService.findAllCategories(getCategoriesDto);
  }

  @ApiCreatedResponse({ type: CategoryEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth(ValidRoles.admin)
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.booksService.createCategory(createCategoryDto);
  }

  @ApiOkResponse({ type: CategoryEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth(ValidRoles.admin)
  @Patch('categories/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.booksService.updateCategory(id, updateCategoryDto);
  }

  @ApiOkResponse({ type: BookEntity })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.booksService.findOne(term);
  }

  @ApiOkResponse({ type: BookEntity })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @ApiOkResponse({ description: 'Address deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth(ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
