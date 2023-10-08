import { ApiProperty } from '@nestjs/swagger';
import { BookEntity } from '../../books/entities/book.entity';
export class RatedBookEntity {
  @ApiProperty({
    description: 'The book rated',
    type: BookEntity
  })
  book: BookEntity;

  @ApiProperty({
    description: 'The rating given to the book by the user',
    type: Number,
    example: 4.5
  })
  rating: number;
}
