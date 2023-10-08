import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ForgotPasswordEmail } from './interfaces/forgot-password-email.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendForgotPassword({ email, name, url, frontendUrl }: ForgotPasswordEmail) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Forgot Password',
      template: './forgot-password',
      context: {
        name,
        url,
        frontendUrl
      }
    });
  }
}
