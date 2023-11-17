import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Webhook handled successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    return this.webhookService.handleWebhooks(signature, rawBody);
  }
}
