import { Module } from "@nestjs/common";
import { RoomModule } from "./room.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/rooms-db"),
    RoomModule,
  ],
})
export class AppModule {}
