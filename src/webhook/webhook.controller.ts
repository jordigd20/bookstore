import { Body, Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    return this.webhookService.handleWebhooks(signature, rawBody);
  }
}
