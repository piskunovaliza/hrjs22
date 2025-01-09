import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from "class-validator";

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  pricePerNight?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
