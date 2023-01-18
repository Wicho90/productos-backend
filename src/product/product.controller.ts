import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-product';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtGaurd } from '../auth/guards/jwt.guard';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post()
    creatProduct(@Body() createPorductDto: CreateProductDto) {
        return this.productService.create(createPorductDto);
    }
    
    @Get()
    findAllProduct(){

        return this.productService.findAll();
    }

    @UseGuards(JwtGaurd)
    @Get(':id')
    findOneProduct(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string) {
        return this.productService.delete(id);
    }
}