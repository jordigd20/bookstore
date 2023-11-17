import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CheckoutEntity } from './entities/checkout.entity';

@ApiTags('orders')
@Auth()
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/checkout-session/:userId')
  @ApiCreatedResponse({ type: CheckoutEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  stripeCheckoutSession(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() checkoutDto: CheckoutDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ordersService.createStripeCheckoutSession(userId, checkoutDto, authUser);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
