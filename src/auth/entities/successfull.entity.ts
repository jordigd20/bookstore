import { ApiProperty } from "@nestjs/swagger";

export class SuccessfullEntity {
  @ApiProperty({
    description: 'Message with a description of the result',
  })
  message: string;

  @ApiProperty({
    description: 'Boolean to confirm the success of the operation',
  })
  ok: boolean;
}