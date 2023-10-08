import { ApiProperty } from "@nestjs/swagger";

export class CategoryEntity {
  @ApiProperty({
    description: 'The id of the category',
    example: 10
  })
  id: number;
  
  @ApiProperty({
    description: 'The name of the category',
    example: 'Mistery & Thriller'
  })
  name: string;
  
  @ApiProperty({
    description: 'The slug of the category',
    example: 'mistery-thriller'
  })
  slug: string;
  
  @ApiProperty({
    description: 'The thumbnail of the category',
    example: 'image-path.png'
  })
  thumbnail: string;
  
  @ApiProperty({
    description: 'The created date of the category',
    example: new Date()
  })
  createdAt: Date;
  
  @ApiProperty({
    description: 'The updated date of the category',
    example: new Date()
  })
  updatedAt: Date;
}