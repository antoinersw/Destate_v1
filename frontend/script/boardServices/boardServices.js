const chalk = require("chalk");
const random = require("../utils/random");


//Mongoose Schema
const roomsModel = require("../../schema/roomsSchema");

//
const dbConnect = require("../utils/dbConnect");

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
const getSquareByPos = async (roomid, x) => {
  const query = { roomid };
  const req = await roomsModel.findOne(query);
  const square = req.squares;
  const selectSquare = square.find((s) => s.pos === x);

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

  console.log([req.players, req.squares]);
  return [req.players, req.squares];
};

module.exports = {
  getSquareByName,
  getSquareByPos,
  isOwned,
  getGameState,
};
