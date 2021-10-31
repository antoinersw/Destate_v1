const randomUuid = () => {
  return "IDxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const txHash = () => {
  return "TXxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const room = () => {
  return "Ryxyxyyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const roll = () => {
  const rollD = Math.floor(Math.random() * 5 + 1);
  return rollD;
};

const randomProperty = (obj) => {
  var objArray = Object.keys(obj);
  var randomNumber = Math.random();
  var objIndex = Math.floor(randomNumber * objArray.length);
  var randomKey = objArray[objIndex];
  // This will return the value of the randomKey
  // instead of a fresh random value
  var randomValue = obj[randomKey];
  return randomValue;
};

const randomOrder = (obj) => {
  var objArray = Object.keys(obj);
  var randomNumber = Math.random();
  var objIndex = Math.floor(randomNumber * objArray.length);
  var randomKey = objArray[objIndex];
  return randomKey;
};

exports.module = {
  randomUuid,
  txHash,
  roll,
  randomProperty,
  randomOrder,
  room,
};
