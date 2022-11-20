import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

   @Get(':id')
   findOne(@Param('id') id: string): Promise<Product> {
      return this.productService.findOne(+id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productService.update(+id, updateProductDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.productService.remove(+id);
   }
}
