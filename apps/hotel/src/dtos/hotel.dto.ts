import { IsString, IsNumber, IsOptional, Min, Max, Length, IsEmail, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
    @IsString()
    @Length(5, 200)
    address!: string;

    @IsString()
    @Length(2, 100)
    city!: string;

    @IsString()
    @Length(2, 100)
    state!: string;

    @IsString()
    @Length(2, 100)
    country!: string;

    @IsString()
    @Length(2, 20)
    zipCode!: string;
}

export class ContactDto {
    @IsString()
    @Length(5, 20)
    phone!: string;

    @IsEmail()
    email!: string;
}

export class CreateHotelDto {
    @IsString()
    @Length(2, 100)
    name!: string;

    @IsOptional()
    @IsString()
    @Length(10, 500)
    description?: string;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location!: LocationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => ContactDto)
    contact!: ContactDto;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;
}

export class UpdateHotelDto {
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?: string;

    @IsOptional()
    @IsString()
    @Length(10, 500)
    description?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ContactDto)
    contact?: ContactDto;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;
}
