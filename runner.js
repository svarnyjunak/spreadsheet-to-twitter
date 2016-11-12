const tweeter = require("./index");
const context = {
  log: console.log,
  done : () => { }
};
tweeter(context, {});