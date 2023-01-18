import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<Product>,

    ) {}

    

    async create(createProductDto: CreateProductDto): Promise<Product> {
        
        try {
            const product = await this.productModel.create( createProductDto );
            return product;
        } catch (error) {
            this.handlerExceptions(error);
        }
        
    }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find();
    }

    async findOne(id: string): Promise<Product> {
        
        if ( !isValidObjectId(id) )
            throw new BadRequestException(`The id sent is not a valid id`);

        const product = await this.productModel.findById(id);
        
        if ( !product )
            throw new NotFoundException(`The product with id "${ id }" does not exist in the database`);

        return product;
        // return await this.productModel.findOne({name: id});
    }

    async update(id: string, updateProductDto:UpdateProductDto) {
        const product = await this.findOne(id);

        try {
            await product.updateOne(updateProductDto);
            return { ...product.toJSON(),...updateProductDto }
        } catch (error) {
            this.handlerExceptions(error);
        }

    }

    async delete(id: string) {

        const { deletedCount } = await this.productModel.deleteOne({ _id: id }).exec();
        
        if ( deletedCount === 0)
            throw new NotFoundException(`The producto with id "${ id }" does not exist in the data base`);

        return { deletedCount };
    }





    private handlerExceptions( error: any) {
        if (error.code === 11000) {
            throw new BadRequestException('this already exist in the database');
        }
        console.log(error);
        
        throw new InternalServerErrorException(`Can not create the product, you should talk to the administrator`);
        
    }


}
