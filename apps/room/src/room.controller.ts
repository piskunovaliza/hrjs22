import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { UpdateRoomDto } from "./update-room.dto";
import { Room } from "./room.schema";

@Controller("api/hotels/:hotelId/rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(
    @Param("hotelId") hotelId: number,
    @Body() roomData: Partial<Room>,
  ) {
    return this.roomService.createRoom(hotelId, roomData);
  }

  @Get(":roomId")
  getRoomById(
    @Param("hotelId") hotelId: number,
    @Param("roomId") roomId: string,
  ) {
    return this.roomService.getRoomById(hotelId, roomId);
  }

  @Put(":roomId")
  updateRoom(
    @Param("hotelId") hotelId: number,
    @Param("roomId") roomId: string,
    @Body() payload: UpdateRoomDto,
  ) {
    return this.roomService.updateRoom(hotelId, roomId, payload);
  }

  @Delete(":roomId")
  deleteRoom(
    @Param("hotelId") hotelId: number,
    @Param("roomId") roomId: string,
  ) {
    return this.roomService.deleteRoom(hotelId, roomId);
  }

  @Get()
  listRooms(@Param("hotelId") hotelId: number, @Query() filters: any) {
    return this.roomService.listRooms(hotelId, filters);
  }
}
