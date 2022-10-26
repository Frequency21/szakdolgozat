import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
   constructor(private readonly productService: ProductService) {}

   @Post()
   create(@Body() createProductDto: CreateProductDto) {
      return this.productService.create(createProductDto);
   }

   @Get()
   findAll() {
      return this.productService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
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
