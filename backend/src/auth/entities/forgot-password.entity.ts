import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordEntity {
  @ApiProperty({
    description: 'Message to confirm the email was sent',
    example: 'Email sent'
  })
  message: string;

  @ApiProperty({
    description: 'Boolean to confirm the email was sent',
    example: true
  })
  ok: boolean;
}