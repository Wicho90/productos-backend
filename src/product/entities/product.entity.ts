import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {

    @Prop({
        required: true,
        index: true
    })
    name: string;

    @Prop({
        required: true,
        index: true,
    })
    price: number;

    @Prop()
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass( Product );