import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity';

export class BookEntity {
  @ApiProperty({
    description: 'The id of the book',
    example: '145'
  })
  id: number;

  @ApiProperty({
    description: 'The ISBN of the book',
    example: '9780261103253',
    minLength: 13,
    maxLength: 13
  })
  ISBN: string;

  @ApiProperty({
    description: 'The slug of the book',
    example: 'harry-potter-and-the-philosopher-stone'
  })
  slug: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Harry Potter and the Philosopher Stone'
  })
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'J. K. Rowling'
  })
  author: string;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Lectorum Publications'
  })
  publisher: string;

  @ApiProperty({
    description: 'The published date of the book',
    example: new Date(1997, 5, 27)
  })
  publishedDate: Date;

  @ApiProperty({
    description: 'The description of the book',
    example:
      "Harry Potter and the Philosopher's Stone is a fantasy novel written by British author J. K. Rowling. The first novel in the Harry Potter series and Rowling's debut novel, it follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school and with the help of his friends, Ron Weasley and Hermione Granger, he faces an attempted comeback by the dark wizard Lord Voldemort, who killed Harry's parents, but failed to kill Harry when he was just 15 months old."
  })
  description: string;

  @ApiProperty({
    description: 'The page count of the book',
    example: 270
  })
  pageCount: number;

  @ApiProperty({
    description: 'The average rating of the book',
    example: 4.5
  })
  averageRating: number;

  @ApiProperty({
    description: 'The number of ratings of the book',
    example: 100
  })
  ratingsCount: number;

  @ApiProperty({
    description: 'The image link of the book',
    example:
      'https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg'
  })
  imageLink: string;

  @ApiProperty({
    description: 'The language of the book',
    example: 'ES',
    minLength: 2,
    format: 'ISO 3166-1 alpha-2'
  })
  language: string;

  @ApiProperty({
    description: 'The total price of the book',
    example: 19.99
  })
  currentPrice: number;

  @ApiProperty({
    description: 'The original price of the book',
    example: 24.99
  })
  originalPrice: number;

  @ApiProperty({
    description: 'The discount of the book in percentage',
    example: 20
  })
  discount: number;

  @ApiProperty({
    description: 'Indicates if the book is a bestseller',
    example: true
  })
  isBestseller: boolean;

  @ApiPropertyOptional({
    description: 'The categories of the book',
    example: [
      {
        id: 10,
        name: 'Mistery & Thriller',
        slug: 'mistery-thriller',
        thumbnail: 'image-path.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    format: 'CategoryEntity[]',
    type: CategoryEntity,
    isArray: true
  })
  categories: CategoryEntity[];

  @ApiProperty({
    description: 'The created date of the book',
    example: new Date()
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated date of the book',
    example: new Date()
  })
  updatedAt: Date;
}
