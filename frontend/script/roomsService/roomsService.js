const chalk = require("chalk");
const random = require("../../script/utils/random").default;

//optimization ideas
//populate rooms & players
const dbConnect = require("../utils/dbConnect");
//Mongoose Schema
const roomsModel = require("../../schema/roomsSchema");

//Ok
const getRooms = async () => {
  const rooms = await roomsModel.find();

  return rooms;
};

//Ok
const getRoomById = async (roomid) => {
  const rooms = await getRooms();
  return (selectedRoom = await rooms.find((r) => r.roomid === roomid));
};

//Ok
const getEmptyRoom = async () => {
  const filter = { isEmpty: true };

  const emptyRoom = await roomsModel.findOne(filter);
  return emptyRoom.roomid;
};
//ok
const getRoomCapacityValidation = async (roomid) => {
  const room = await getRoomById(roomid);
  const max = room.maxPlayer;
  const playersLength = room.players.length;

  return max === playersLength;
};

//Ok
const isRoomEmpty = async (roomid) => {
  const room = await getRoomById(roomid);
  const max = room.maxPlayer;
  const playersLength = room.players.length;

  return playersLength === 0;
};

module.exports = {
  getRooms,
  getRoomById,
  getEmptyRoom,
  getRoomCapacityValidation,
  isRoomEmpty,
};
