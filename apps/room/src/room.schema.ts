import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  hotelId: number;

  @Prop({ required: true })
  roomType: string;

  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  pricePerNight: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: [String] })
  amenities: string[];

  @Prop({ default: true })
  available: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
