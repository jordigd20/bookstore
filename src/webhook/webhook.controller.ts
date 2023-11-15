import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  webhook(@Headers('stripe-signature') signature: string, @Body() body: any) {
    return this.webhookService.handleWebhooks(signature, body);
  }
}
