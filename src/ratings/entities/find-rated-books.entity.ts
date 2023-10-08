import { ApiProperty } from "@nestjs/swagger";
import { RatedBookEntity } from "./rated-book.entity";

export class FindRatedBooksEntity {
  @ApiProperty({
    description: 'The array of books found',
    type: RatedBookEntity,
    isArray: true
  })
  data: RatedBookEntity[];

  @ApiProperty({
    description: 'The pagination data',
    type: Object,
    example: {
      skip: 0,
      take: 10,
      total: 100
    }
  })
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}