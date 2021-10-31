const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
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
});
module.exports =
  mongoose.models.rooms || mongoose.model("squares", roomsSchema, "Squares");
