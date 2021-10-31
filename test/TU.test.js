const {
  getProfils,
  getSquareByPos,
  getProfilbyUserId,
  buyPlace,
  rollDice,
  playOrder,
  convertPosition,
  flagCurrentAndNextPlayer,
  updatePlayerPosition,
  searchAndRevokeOwnership,
  getNextPlayer,
} = require("../server/fx");

let userId = "ID238725-2fa0-4078-816e-623178f77ce0";

it("must return all current profils (not be null and lengthy)", () => {
  expect(getProfils().toBeDefined);
});

it("must return the Go square", () => {
  expect(getSquareByPos(0)).toHaveProperty("name");
});

it("must return the user Profil", () => {
  expect(getProfilbyUserId(userId)).toBeDefined;
});

it("must return convert the integer to an x & y object", () => {
  expect(convertPosition(10)).toHaveProperty("y", 10);
  expect(convertPosition(10)).toHaveProperty("x", 0);

  expect(convertPosition(20)).toHaveProperty("y", 10);
  expect(convertPosition(20)).toHaveProperty("x", 10);

  expect(convertPosition(30)).toHaveProperty("y", 0);
  expect(convertPosition(30)).toHaveProperty("x", 10);
});

it("must return the next player n+1", () => {
  expect(getNextPlayer(2, "TESTROOM_").toBeDefined);
});
