import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common';
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
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CheckoutEntity } from './entities/checkout.entity';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { FindOrdersDto } from './dto/find-orders.dto';
import { OrderEntity } from './entities/order.entity';
import { LastOrdersEntity } from './entities/last-orders.entity';

@ApiTags('orders')
@Auth()
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiCreatedResponse({ type: CheckoutEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Post('/checkout-session/:userId')
  stripeCheckoutSession(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() checkoutDto: CheckoutDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ordersService.createStripeCheckoutSession(userId, checkoutDto, authUser);
  }

  @ApiCreatedResponse({ type: OrderEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth('jwt', ValidRoles.admin)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOkResponse({ type: OrderEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get('/user/:userId')
  findAllByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() findOrdersDto: FindOrdersDto,
    @GetUser() authUser: AuthUser
  ) {
    return this.ordersService.findAllByUserId(userId, findOrdersDto, authUser);
  }

  @ApiOkResponse({ type: LastOrdersEntity, isArray: true })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get('/last-orders/:userId')
  findLastOrdersByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() authUser: AuthUser
  ) {
    return this.ordersService.findLastOrdersByUserId(userId, authUser);
  }

  @ApiOkResponse({ type: OrderEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() authUser: AuthUser) {
    return this.ordersService.findOne(id, authUser);
  }

  @ApiOkResponse({ type: OrderEntity })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth('jwt', ValidRoles.admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOkResponse({ description: 'Order deleted successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @Auth('jwt', ValidRoles.admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
