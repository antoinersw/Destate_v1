const chalk = require("chalk");
const random = require("../../script/utils/random");

//optimization ideas
//populate rooms & players

//Mongoose Schema
//const roomsModel = require("../../schema/roomsSchema")
//
//
const dbConnect = require("../../script/utils/dbConnect");

const player =require("../playersService/playersService");

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

module.exports = {
  saveBuyTx,
  savePos,
  saveBuyTx,
  saveTxOnProfil,
  saveTxOnSquare,
  saveWallet,
  searchAndRevokeOwnership,
  passTurn,
  buyPlace,
  rollDice,
  playOrder,
  play,
};
