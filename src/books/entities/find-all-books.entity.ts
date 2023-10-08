import { ApiProperty } from "@nestjs/swagger";
import { BookEntity } from "./book.entity";

export class FindAllBooksEntity {
  @ApiProperty({
    description: 'The array of books found',
    type: BookEntity,
    isArray: true
  })
  data: BookEntity[];

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