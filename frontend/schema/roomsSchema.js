const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
  players: [
    {
      userId: {
        type: "String",
      },
      name: {
        type: "String",
      },
      email: {
        type: "String",
      },
      walletAmount: {
        type: "Number",
      },
      owns: {
        type: "Array",
      },
      owned: {
        type: "Array",
      },
      pawn: {
        type: "String",
      },
      roomid: {
        type: "String",
      },
      next: {
        type: "Boolean",
      },
      pos: {
        type: "Number",
      },
      transactions: {
        type: "Array",
      },
      order: {
        type: "String",
      },
      rolled: {
        type: "Boolean",
      },
    },
  ],
  squares: [
    {
      owner: {
        type: "Array",
      },
      prevowner: {
        type: "Array",
      },
      name: {
        type: "String",
      },
      type: {
        type: "String",
      },
      color: {
        type: "String",
      },
      pos: {
        type: "Number",
      },
      pick: [
        {
          name: {
            type: "String",
          },
          type: {
            type: "String",
          },
          pos: {
            x: {
              type: "Number",
            },
            y: {
              type: "Number",
            },
          },
        },
      ],
    },
  ],
  roomid: {
    type: "String",
  },
  isEmpty: {
    type: "Boolean",
  },
});



module.exports = mongoose.models.rooms || mongoose.model("rooms", roomsSchema, "Rooms");

