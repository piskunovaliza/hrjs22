import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room } from "./room.schema";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async createRoom(hotelId: number, roomData: Partial<Room>) {
    if (!roomData.roomNumber || !roomData.roomType) {
      throw new BadRequestException("Room number and type are required.");
    }
    const newRoom = new this.roomModel({ hotelId, ...roomData });
    return await newRoom.save();
  }

  async getRoomById(hotelId: number, roomId: string) {
    return await this.roomModel.findOne({ hotelId, _id: roomId });
  }

  async updateRoom(hotelId: number, roomId: string, updateData: Partial<Room>) {
    if (!updateData) {
      throw new BadRequestException("Update data cannot be empty.");
    }
    return await this.roomModel.findOneAndUpdate(
      { hotelId, _id: roomId },
      updateData,
      { new: true },
    );
  }

  async deleteRoom(hotelId: number, roomId: string) {
    return await this.roomModel.findOneAndDelete({ hotelId, _id: roomId });
  }

  async listRooms(hotelId: number, filters: any) {
    const matchStage = { hotelId, ...filters };

    const aggregationResult = await this.roomModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          data: [{ $skip: filters.skip ?? 0 }, { $limit: filters.limit ?? 10 }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const [result] = aggregationResult;
    return {
      rooms: result.data,
      total: result.totalCount[0]?.count ?? 0,
    };
  }
}
