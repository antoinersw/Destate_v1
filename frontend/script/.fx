//const random = require("../script/utils/random").default;
//const date = require("../../server/utils/date");
const chalk = require("chalk");
const mongoose = require("mongoose");
// let axiosDefaults = require("axios/lib/defaults");
// axiosDefaults.baseURL = "http://localhost:3000";

//Mongoose Schema
const roomsModel = require("../schema/roomsSchema");

//Get functions

const dbConnect = require("./utils/dbConnect");

const getProfils = async (roomid) => {
  try {
    const query = { roomid };
    const room = await roomsModel.findOne(query);
    const profils = await room.players;
    console.log(profils);

    return profils;
  } catch (err) {
    console.log(err);
    return err;
  }
};

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

const getFirstPlayer = async (roomid) => {
  const profils = await getProfils(roomid);
  const askFirstPlayer = profils.find((f) => f.order === 0);
  return askFirstPlayer;
};

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

//ERREUR POSSIBLE
const getSquareByPos = async (roomid, x) => {
  const room = await getRoomById(roomid);
  const pos = { "squares.$.pos": x };
  const square = await roomsModel.findOne(room, pos);

  return square;
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

const getPlayerSquareByPos = async (roomid, userId) => {
  const profil = await getProfilbyUserId(roomid, userId);
  const position = profil.pos;
  const square = await getSquareByPos(position);
  return square;
};

//Ok
const getRooms = async () => {
  const rooms = await roomsModel.find();
  console.log(rooms);
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

const getPlayerState = async (roomid, userId) => {
  const profil = await getProfilbyUserId(roomid, userId);
  const square = await getSquareByPos(profil.pos);

  const result = [profil, square];
  console.log(result);
  return result;
};

const getGameState = async (roomid) => {
  const query = { roomid };
  const req = await roomsModel.findOne(query);

  console.log([req.players, req.squares]);
  return [req.players, req.squares];
};

const convertPosition = (pos) => {
  if (pos >= 0 && pos <= 10) {
    return { y: pos, x: 0 };
  } else if (pos > 10 && pos <= 20) {
    return { y: 10, x: pos - 10 };
  } else if (pos > 20 && pos < 30) {
    return { y: 10 - (pos % 10), x: 10 };
  } else if (pos > 30 && pos < 40) {
    return { y: 0, x: 10 - (pos % 10) };
  } else if (pos === 40) {
    return { y: 0, x: 1 };
  } else if (pos === 30) {
    return { y: 0, x: 10 };
  } else {
    return "error: position not registered";
  }
};

const saveBuyTx = async (roomid, findBuyer, findPlace) => {
  const txId = random.txHash();
  const cursor = { roomid, "players.userId": findBuyer.userId };
  const tx = {
    $push: {
      "players.$.transactions": {
        txId,
        type: findPlace.type,
        price: findPlace.price,
        name: findPlace.name,
        timestamp,
      },
    },
  };

  const query = await roomsModel.updateOne(cursor, tx);
};

const savePos = async (roomid, selectProfil) => {
  const id = { roomid, "players.userId": selectProfil.userId };
  const pos = { $set: { "players.$.pos": selectProfil.pos } };

  const query = await roomsModel.updateOne(id, pos);
};

const saveTxOnProfil = async (roomid, findBuyer, findPlace) => {
  const id = { roomid, "players.userId": findBuyer.userId };
  wallet = {
    $set: {
      "players.$.walletAmount": findBuyer.walletAmount - findPlace.price,
    },
  };
  owns = { $push: { "players.$.owns": findPlace.name } };
  const updateWallet = await roomsModel.updateOne(id, wallet);
  const addOwnership = await roomsModel.updateOne(id, owns);
};

const saveWallet = async (roomid, selectProfil) => {
  query = { roomid, "players.userId": selectProfil.userId };
  field = { $set: { "players.$.walletAmount": selectProfil.walletAmount } };
  await roomsModel.updateOne(query, field);
};
const saveTxOnSquare = async (roomid, findBuyer, findPlace) => {
  id = { roomid, "squares.name": findPlace.name };
  fields = {
    $set: {
      "squares.$.price": Math.floor(findPlace.price * 1.1),
      "squares.$.owner": findBuyer.userId,
    },
  };

  const query = await roomsModel.updateOne(id, fields);
};

const updateNextPlayerTurn = async (roomid, askNextPlayer) => {
  id = { roomid, "players.userId": askNextPlayer.userId };
  fields = { $set: { "players.$.next": true, "players.$.rolled": false } };
  const update = await roomsModel.updateOne(id, fields);
};

const updateFirstPlayerTurn = async (roomid, askFirstPlayer) => {
  id = { roomid, "players.userId": askFirstPlayer.userId };
  fields = { $set: { "players.$.next": true, "players.$.rolled": false } };
  const update = await roomsModel.updateOne(id, fields);
};

const searchAndRevokeOwnership = async (roomid, userId, findPlace) => {
  const profils = await getProfils(roomid);
  for (i = 0; i < profils.length; i++) {
    const findOwnership = profils[i].owns.includes(findPlace.name);

    //delete the ownership of the previous owner
    //if the ownership is found on the [i] profil
    //and if the owner userId is different from the userId provided in argument
    if (findOwnership && profils[i].userId != userId) {
      let updateOwnership = profils[i].owns.filter(
        (item) => item != findPlace.name
      );
      profils[i].owns = updateOwnership;
      cursor = { roomid, "players.userId": profils[i].userId };
      filter = { $set: { "players.$.owns": updateOwnership } };
      //filter = { $pull: { "players.$.owns": findPlace.name } };
      const revoke = await roomsModel.updateOne(cursor, filter);

      console.log(
        profils[i].name + " just had its ownsership revoked",
        "He/she currently owns",
        profils[i].owns
      );
    }
  }
};

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
const updatePlayerRoll = async (roomid, userId) => {
  id = { roomid, "players.userId": userId };
  fields = { $set: { "players.$.rolled": true } };
  const update = await roomsModel.updateOne(id, fields);
};

const passTurn = async (roomid, userId) => {
  const selectProfil = await getProfilbyUserId(roomid, userId);

  const profils = await getProfils(roomid);

  await updateCurrentPlayerTurn(roomid, selectProfil);
  const profilsLength = profils.length;
  const playerTurn = selectProfil.order;
  if (playerTurn < profilsLength - 1) {
    //2 < 4
    const askNextPlayer = await getNextPlayer(roomid, playerTurn);
    console.log(askNextPlayer.userId, "is the next player");

    updateNextPlayerTurn(roomid, askNextPlayer);

    return askNextPlayer.userId;
  } else if (Number(playerTurn) == profilsLength - 1) {
    //1 =1
    const askFirstPlayer = await getFirstPlayer(roomid);
    console.log(askFirstPlayer.userId, "is the next player");

    updateFirstPlayerTurn(roomid, askFirstPlayer);

    return askFirstPlayer.userId;
  } else {
    console.log("bug with turn assignement");
  }
};

const buyPlace = async (roomid, userId, place) => {
  const findPlace = await getSquareByName(roomid, place);
  const findBuyer = await getProfilbyUserId(roomid, userId);

  if (findBuyer.next === false && findBuyer.rolled === true) {
    console.log(chalk.red.inverse("It's not your turn to play "));
  } else if (findBuyer.pos === findPlace.pos) {
    let askPrice = findPlace.price;
    let avbAmount = findBuyer.walletAmount;
    const ownedDistricts = await findBuyer.owns.includes(place);

    if (ownedDistricts) {
      console.log("You have already bought this place");
    } else if (findPlace && findBuyer && askPrice <= avbAmount) {
      console.log("conditions met for placing a buy order");
      await searchAndRevokeOwnership(roomid, userId, findPlace);
      await saveTxOnProfil(roomid, findBuyer, findPlace);
      await saveTxOnSquare(roomid, findBuyer, findPlace);
      await saveBuyTx(roomid, findBuyer, findPlace);
      console.log(chalk.green.inverse("New district bought!"));
      //flag player turn as false
      await passTurn(roomid, userId);
    } else {
      console.log(
        chalk.red.inverse("conditions not met for placing a buy order")
      );
    }
  }
};

//lancer 2 d�s et obtenir un nombre random
const rollDice = async () => {
  const roll1 = random.roll();

  console.log("Current Roll is ", roll1);
  return roll1;
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

const play = async (roomid, userId) => {
  const selectProfil = await getProfilbyUserId(roomid, userId);

  if (selectProfil.rolled === true) {
    console.log(`Player ${selectProfil.userId} not allowed to play(rollDice)`);
    return;
  }
  // const roll1 = await rollDice();
  // //update position
  // await updatePlayerPosition(roll1, selectProfil);

  selectProfil.pos = 2;
  await savePos(roomid, selectProfil);

  const selectS = await getSquareByPos(selectProfil.pos);
  const selectSquare = selectS.toObject();
  const squareType = selectSquare.type;
  const ownership = await isOwned(roomid, selectSquare, squareType);

  if (selectProfil === "owned" && squareType === "field") {
    console.log(
      chalk.yellow.inverse("You stepped on " + selectSquare.name + ".")
    );
    console.log(
      chalk.yellow.inverse(
        "This district is occupied, you must pay a fee to the owner !"
      )
    );
    console.log(
      chalk.yellow.inverse(
        "You must pay " + Math.floor(selectSquare.price) + " to buy this place."
      )
    );
    await updatePlayerRoll(userId);
  } else if (ownership != "owned" && squareType === "field") {
    console.log(
      chalk.yellow.inverse(
        `You stepped on ${selectSquare.name}. It's a free district, you can buy it for ${selectSquare.price} `
      )
    );
    await updatePlayerRoll(roomid, userId);
  } else if (ownership === "owned" && squareType === "train stations") {
    console.log(
      chalk.yellow.inverse("You stepped on " + selectSquare.name + ".")
    );
    console.log(
      chalk.yellow.inverse(
        "This train station is occupied, you must pay a fee to the owner !"
      )
    );
    console.log(chalk.yellow.inverse("You must pay a fee for staying here"));
    console.log(
      chalk.yellow.inverse(
        "You must pay " + selectSquare.price + " to buy this place."
      )
    );
    await updatePlayerRoll(roomid, userId);
  } else if (ownership != "owned" && squareType === "train stations") {
    console.log(chalk.green.inverse("You stepped on a free train station !"));
    console.log(selectSquare.name, selectSquare.price);
    console.log(
      chalk.green.inverse(`You can buy it for  ${selectSquare.price}  !`)
    );
    await updatePlayerRoll(roomid, userId);
  } else if (squareType === "public") {
    const communityCards = selectSquare.pick;
    const selectRandomCard = random.randomProperty(communityCards);
    const randomCardType = selectRandomCard.type;
    const randomCardAmount = selectRandomCard.amount;
    const randomCardPos = selectRandomCard.pos;

    console.log(
      chalk.yellowBright.inverse("You stepped on a community square.")
    );
    console.log(chalk.yellowBright.inverse(`${selectRandomCard.name}`));
    if (randomCardType === "earn") {
      selectProfil.walletAmount + randomCardAmount;
      await saveWallet(roomid, selectProfil);
      console.log("Money has been withdrawn");
      await passTurn(roomid, userId);
    } else if (randomCardType === "fee") {
      //PAY FEE => TO DO

      selectProfil.walletAmount - randomCardAmount;
      await saveWallet(roomid, selectProfil);
      console.log("fee has been deducted");
      await passTurn(roomid, userId);
    } else if (randomCardType === "move") {
      console.log("position has been updated");
      selectProfil.pos = randomCardPos;
      await savePos(roomid, selectProfil);
      await passTurn(roomid, userId);
    } else if (randomCardType === "moveBackward") {
      console.log("you moved backward");
      selectProfil.pos - randomCardPos;
      await savePos(roomid, selectProfil);
      await passTurn(roomid, userId);
    } else {
      console.log("randomCardType:", randomCardType);
      return;
    }
  } else {
    return;
  }
};

const addFirstProfil = async (roomid, name, pawn, maxPlayer) => {
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

// const handlePlayerQuits = async (roomid, userId) => {
//   const query = { roomid };
//   const subfield = { $pull: { players: { userId } } };
//   const roomL = await getRoomLength(roomid);
//   const res = await roomsModel.updateOne(query, subfield);
//   console.log(roomL);
//   if (roomL) {
//     makeEmpty = { $set: { isEmpty: true } };
//     const e = await roomsModel.updateOne(query, makeEmpty);
//     console.log("EERERE", e);
//   }

//   console.log(res);
//   return res;
// };

const playOrder = async (roomid) => {
  const profils = await getProfils(roomid);

  const array = Object.keys(profils);
  const randomOrder = array.sort(() => Math.random() - Math.random()).slice(0);
  const finalOrders = [];
  for (i = 0; i < array.length; i++) {
    // console.log(
    //   "TEST:",
    //   { userId: profils[i].userId },
    //   { order: Number(randomOrder[i]) }
    // );
    const randomO = Number(randomOrder[i]);

    query = { roomid, "players.userId": profils[i].userId };
    order = { $set: { "players.$.order": randomO } };
    next = { $set: { "players.$.next": true } };

    finalOrders.push(roomsModel.updateOne(query, order));
    if (Number(randomO) === 0) {
      finalOrders.push(roomsModel.updateOne(query, next));
    }
  }
  await Promise.all(finalOrders);
};

const simulate = async (roomid, userId) => {
  const selectProfil = await getProfilbyUserId(roomid, userId);

  //const roll1 = await rollDice();
  //update position
  // await updatePlayerPosition(roll1, selectProfil);
  selectProfil.pos = 2;
  await savePos(roomid, selectProfil);

  const selectS = await getSquareByPos(selectProfil.pos);
  const selectSquare = selectS.toObject();
  const squareType = selectSquare.type;
  const ownership = await isOwned(roomid, selectSquare, squareType);

  if (squareType === "public") {
    console.log("type public");
  }
};

//simulate("TESTROOM_", "IDc84831-cf7e-4a62-a070-4a2e1aafe181");
//getProfils("TESTROOM_");
//getSquareByPos(16);
//passTurn("TESTROOM_", "IDc84831-cf7e-4a62-a070-4a2e1aafe181");
//getNextPlayer("TESTROOM_");
//getPlayerState("TESTROOM_", "IDc84831-cf7e-4a62-a070-4a2e1aafe181");
//getSquareByName("TESTROOM_", "Faubourg Saint-Honoré");
//handlePlayerQuits("TESTROOM_", "IDc84831-cf7e-4a62-a070-4a2e1aafe181");
// await addFirstProfil("TESTROOM_", "Picsou", "Gold Coin", 4);
// await joinRoom("TESTROOM_", "Mickey", "Cheese");
// await joinRoom("TESTROOM_", "Donald", "Potato");
// await joinRoom("TESTROOM_", "Tom", "Tuna");
// await playOrder("TESTROOM_");
const simulateGame = async (roomid, firstPlayer) => {
  i = 0;
  const profil = await getProfilbyUserId(roomid, firstPlayer);
  await play("TESTROOM_", profil.userId);
  while (i < 30) {
    const next = await getNextPlayer(roomid, profil.order);
    //console.log(next);
    await play("TESTROOM_", next.userId);
  }
};

//simulateGame("TESTROOM_", "ID2ac7bd-ac7c-4320-9b1d-5b2030b75d31");
//play("TESTROOM_", "IDc84831-cf7e-4a62-a070-4a2e1aafe181");
//buyPlace("TESTROOM_", "ID2ac7bd-ac7c-4320-9b1d-5b2030b75d31", "Avenue Matignon");

//getGameState("TESTROOM_");
module.exports = {
  getProfils,
  getNextPlayer,
  getProfilbyUserId,
  addFirstProfil,
  getSquareByPos,
  buyPlace,
  rollDice,
  playOrder,
  convertPosition,
  passTurn,
  saveBuyTx,
  updatePlayerPosition,
  searchAndRevokeOwnership,
  playOrder,
  getPlayerSquareByPos,
  getEmptyRoom,
  getRooms,
  getRoomById,
  isRoomEmpty,
};
