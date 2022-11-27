import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   InternalServerErrorException,
   Param,
   ParseIntPipe,
   Post,
   Query,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BidDto } from './dto/bid.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @UseGuards(CookieAuthGuard)
   @Post()
   create(@Body() createProductDto: CreateProductDto): Promise<
      {
         name: string;
         signedUrl: string;
         url: string;
      }[]
   > {
      return this.productService.create(createProductDto);
   }

   @Get('simple')
   findAll(@Query('categoryId') categoryId?: string): Promise<Product[]> {
      const parsedCategoryId = Number(categoryId);
      return this.productService.findAll(
         Number.isNaN(parsedCategoryId) ? undefined : parsedCategoryId,
      );
   }

   @Post('filter')
   findWhere(@Body() findProductDto: FindProductDto): Promise<Product[]> {
      return this.productService.findWhere(findProductDto);
   }

   @UseGuards(CookieAuthGuard)
   @Post('bid')
   bid(@Body() { newPrice, productId }: BidDto, @CurrentUser() user: User) {
      return this.productService.bid(user, newPrice, productId);
   }

   /** megvett termékek */
   @UseGuards(CookieAuthGuard)
   @Get('bought')
   findBoughtProductsForBuyer(@CurrentUser() user: User): Promise<Product[]> {
      return this.productService.boughtProductsForBuyer(user.id);
   }

   /** lejárt aukciók */
   @UseGuards(CookieAuthGuard)
   @Get('expired')
   findExpiredAuctionsForSeller(
      @CurrentUser() seller: User,
   ): Promise<Product[]> {
      return this.productService.expiredAuctionsForSeller(seller.id);
   }

   /** függőben lévő hírdetések (aukciók is) */
   @UseGuards(CookieAuthGuard)
   @Get('pending')
   findPendingProductsForSeller(
      @CurrentUser() seller: User,
   ): Promise<Product[]> {
      return this.productService.pendingProductsForSeller(seller.id);
   }

   /** sikeres hírdetések */
   @UseGuards(CookieAuthGuard)
   @Get('success')
   findSuccessProductsForSeller(
      @CurrentUser() seller: User,
   ): Promise<Product[]> {
      return this.productService.successProductsForSeller(seller.id);
   }

   /** sikeres aukciók */
   @UseGuards(CookieAuthGuard)
   @Get('success-auctions')
   findSuccessAuctionsForBuyer(@CurrentUser() buyer: User): Promise<Product[]> {
      return this.productService.successAuctionsForBuyer(buyer.id);
   }

   /** megnyert aukciók */
   @UseGuards(CookieAuthGuard)
   @Get('won')
   findWonAuctionsForBuyer(@CurrentUser() buyer: User): Promise<Product[]> {
      return this.productService.wonAuctionsForBuyer(buyer.id);
   }

   @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
      return this.productService.findOne(id);
   }

   @UseGuards(CookieAuthGuard)
   @Delete(':id')
   async remove(
      @CurrentUser() user: User,
      @Param('id', ParseIntPipe) id: number,
   ): Promise<void> {
      const affected = await this.productService.remove(user, id);
      if (affected !== 1) {
         throw new InternalServerErrorException({
            message: 'Sikertelen törlés',
         });
      }
   }
}
