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
// WEIRD ROUTING BUG
const getSquareByName = async (roomid, name) => {
  try {
    const query = { roomid };
    const req = await roomsModel.findOne(query);
    const squares = req.squares;
    selectSquare = squares.find((s) => s.name === name);
    console.log(selectSquare);
    return selectSquare;
  } catch (err) {
    console.log(err);
    return err;
  }
};

//OK
const getSquareByPos = async (roomid, x) => {
  const query = { roomid };
  const req = await roomsModel.findOne(query);
  const square = req.squares;
  const selectSquare = await square.find((s) => s.pos === x);

  return selectSquare;
};

const isOwned = async (roomid, selectSquare, type) => {
  if (type != "field" && type != "train stations") {
    return "Cannot be owned";
  } else if (type === "field") {
    //const findPlace = await getSquareByName(roomid, place);
    if (selectSquare === undefined) {
      console.log("wrong input");
      return;
    } else if (selectSquare.owner.length > 0) {
      return "owned";
    } else {
      return "free";
    }
  }
};
const getGameState = async (roomid) => {
  const query = { roomid };
  const req = await roomsModel.findOne(query);

  return [req.players, req.squares];
};

module.exports = {
  getRooms,
  getRoomById,
  getEmptyRoom,
  getRoomCapacityValidation,
  isRoomEmpty,
  getSquareByName,
  getSquareByPos,
  isOwned,
  getGameState,
};
