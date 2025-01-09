import { Request, Response } from "express";
import { HotelService } from "./hotel.service";
import { logger } from "./config/loggerConfig";
import { CreateHotelDto, UpdateHotelDto } from "./dtos/hotel.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class HotelController {
    constructor(private readonly hotelService: HotelService) {}

    async getAllHotels(_req: Request, res: Response): Promise<Response> {
        try {
            logger.info("Getting all hotels");
            const hotels = await this.hotelService.findAll();
            return res.status(200).json({ hotels });
        } catch (err: any) {
            logger.error(err.message);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createHotel(req: Request, res: Response): Promise<Response> {
        try {
            logger.info("Creating a new hotel");

            const hotelDto = plainToClass(CreateHotelDto, req.body);
            
            const errors = await validate(hotelDto, { whitelist: true });
            if (errors.length > 0) {
                logger.error("Validation failed", { errors });
                return res.status(400).json({ 
                    message: "Validation failed",
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
            }

            const hotel = await this.hotelService.createOne(hotelDto);
            return res.status(201).json({
                message: "Hotel created successfully",
                hotel
            });
        } catch (error: any) {
            logger.error(error.message);
            if (error.name === 'NotFoundException') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(400).json({ message: error.message });
        }
    }

    async getHotelById(req: Request, res: Response): Promise<Response> {
        try {
            logger.info("Getting hotel by ID");
            const idParam = req.params.id;
            if (!idParam) {
                logger.error("Hotel ID is not provided");
                return res.status(400).json({ message: "Hotel ID is required" });
            }

            const hotel = await this.hotelService.findOneById(idParam);
            return res.status(200).json(hotel);
        } catch (error: any) {
            logger.error(error.message);
            if (error.name === 'NotFoundException') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateHotel(req: Request, res: Response): Promise<Response> {
        try {
            logger.info("Updating hotel by ID");
            const idParam = req.params.id;
            if (!idParam) {
                logger.error("Hotel ID is not provided");
                return res.status(400).json({ message: "Hotel ID is required" });
            }

            const updateDto = plainToClass(UpdateHotelDto, req.body);
            
            const errors = await validate(updateDto, { whitelist: true, skipMissingProperties: true });
            if (errors.length > 0) {
                logger.error("Validation failed", { errors });
                return res.status(400).json({ 
                    message: "Validation failed",
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
            }

            const exists = await this.hotelService.exists(idParam);
            if (!exists) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const hotel = await this.hotelService.updateOneById(idParam, updateDto);
            return res.status(200).json(hotel);
        } catch (error: any) {
            logger.error(error.message);
            if (error.name === 'NotFoundException') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteHotel(req: Request, res: Response): Promise<Response> {
        try {
            logger.info("Deleting hotel by ID");
            const idParam = req.params.id;
            if (!idParam) {
                logger.error("Hotel ID is not provided");
                return res.status(400).json({ message: "Hotel ID is required" });
            }

            await this.hotelService.deleteOneById(idParam);
            return res.status(204).send();
        } catch (error: any) {
            logger.error(error.message);
            if (error.name === 'NotFoundException') {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}