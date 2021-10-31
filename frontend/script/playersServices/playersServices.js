const chalk = require("chalk");
const random = require("../utils/random");
const { v4: uuidv4 } = require("uuid");
//optimization ideas
//populate rooms & players

//Mongoose Schema
const roomsModel = require("../../schema/roomsSchema");
//
const dbConnect = require("../utils/dbConnect");
const room = require("../roomsService/roomsService");

//Get
//OK
const getProfils = async (roomid) => {
  try {
    const query = { roomid };
    const room = await roomsModel.findOne(query);
    const profils = await room.players;

    return profils;
  } catch (err) {
    console.log(err);
    return err;
  }
};
//OK
const getProfilbyUserId = async (roomid, userId) => {
  try {
    const room = { roomid };

    const query = await roomsModel.findOne(room);
    const profils = query.players;

    const selectProfil = await profils.find((e) => e.userId === userId);

    return selectProfil;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getNextPlayer = async (roomid, playerTurn) => {
  try {
    const nextPlayer = playerTurn + 1;
    const profils = await getProfils(roomid);
    const askNextPlayer = await profils.find((o) => o.order === nextPlayer);
    if (askNextPlayer) {
      return askNextPlayer;
    } else {
      console.log("Can't find next player. last Player didn't fully played");
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
//ok
const getPlayerState = async (roomid, userId) => {
  const profil = await getProfilbyUserId(roomid, userId);
  const square = await room.getSquareByPos(roomid, profil.pos);

  const result = [profil, square];
  return result;
};

//ok
const getFirstPlayer = async (roomid) => {
  const profils = await getProfils(roomid);
  const askFirstPlayer = profils.find((f) => f.order === 0);
  return askFirstPlayer;
};

//Useful ?
const getPlayerSquareByPos = async (roomid, userId) => {
  const profil = await getProfilbyUserId(roomid, userId);
  const position = profil.pos;
  const square = await room.getSquareByPos(position);
  return square;
};

// referenced in passTurn() //actionsServices
const updateNextPlayerTurn = async (roomid, askNextPlayer) => {
  id = { roomid, "players.userId": askNextPlayer.userId };
  fields = { $set: { "players.$.next": true, "players.$.rolled": false } };
  const update = await roomsModel.updateOne(id, fields);
};

// referenced in passTurn() //actionsServices
const updateFirstPlayerTurn = async (roomid, askFirstPlayer) => {
  id = { roomid, "players.userId": askFirstPlayer.userId };
  fields = { $set: { "players.$.next": true, "players.$.rolled": false } };
  const update = await roomsModel.updateOne(id, fields);
};

// referenced in passTurn() //actionsServices
const updateCurrentPlayerTurn = async (roomid, selectProfil) => {
  selectProfil.next = false;
  selectProfil.rolled = true;
  query = { roomid, "players.userId": selectProfil.userId };
  fields = {
    $set: {
      "players.$.next": selectProfil.next,
      "players.$.rolled": selectProfil.rolled,
    },
  };
  const update = await roomsModel.updateOne(query, fields);
};
//changes status false to true of player's roll property

// referenced in play //actionsServices
const updatePlayerRoll = async (roomid, userId) => {
  id = { roomid, "players.userId": userId };
  fields = { $set: { "players.$.rolled": true } };
  const update = await roomsModel.updateOne(id, fields);
};
const updatePlayerPosition = async (roll, selectProfil) => {
  if (roll + selectProfil.pos >= 40) {
    selectProfil.pos = roll + selectProfil.pos - 39;
    return selectProfil;
  } else {
    selectProfil.pos += roll;
    return selectProfil;
  }
};

//post
const addFirstProfil = async (roomid, name, pawn, maxPlayer) => {
  let userId = uuidv4();

  const _profil = {
    userId,
    name,
    walletAmount: 10000,
    owns: [],
    owned: [],
    pawn,
    next: false,
    pos: 0,
    transactions: [],
  };

  if (name === "" || pawn === "") {
    console.log("you didnt fill a field");
    return;
  } else if (
    name != undefined ||
    email != undefined ||
    pawn != undefined ||
    roomid != undefined
  ) {
    //a check must be made to prevent the same guy to execute the fx twice
    const query = { roomid };
    const fields = { $set: { maxPlayer, players: _profil, isEmpty: false } };
    const req = await roomsModel.updateOne(query, fields);
    const createProfil = await roomsModel.updateOne(query, {
      players: _profil,
    });
    console.log(chalk.green.inverse("New profil added!"));
  } else {
    console.log(chalk.red.inverse("error: bug adding a profil"));
  }
};

const joinRoom = async (roomid, name, pawn) => {
  //make a check to prevent the same guy to be able to join the room twice
  let userId = random.randomUuid();

  const _profil = {
    userId,
    name,
    walletAmount: 10000,
    owns: [],
    owned: [],
    pawn,
    next: false,
    pos: 0,
    transactions: [],
  };

  const isFull = await getRoomCapacityValidation(roomid);

  if (isFull.maxC) {
    return "full";
  }
  //a check must be made to prevent the same guy to execute the fx twice
  const query = { roomid: roomid };
  const fields = { $push: { players: _profil } };
  const req = await roomsModel.updateOne(query, fields);
  console.log(chalk.green.inverse("New profil added!"));
};

module.exports = {
  getProfils,
  getProfilbyUserId,
  getNextPlayer,
  getFirstPlayer,
  getPlayerSquareByPos,
  getPlayerState,
  updateNextPlayerTurn,
  updateFirstPlayerTurn,
  updateCurrentPlayerTurn,
  updatePlayerRoll,
  updatePlayerPosition,
  addFirstProfil,
  joinRoom,
};
