const _ = require("lodash");
const gsjson = require("google-spreadsheet-to-json");

const keys = {
  "consumer_key": process.env.CONSUMER_KEY,
  "consumer_secret": process.env.CONSUMER_SECRET,
  "access_token_key": process.env.ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
};

const googleSpreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

function isForDate(item, date) {
  return item.day === date.getDate() && item.month === (date.getMonth() + 1);
}

function getItemsForDate(items, date) {
  return items.filter(d => { return isForDate(d, date) });
}

function sendTweet(status) {
  return new Promise((resolve, reject) => {
    const twitter = require("tuiter")(keys);
    twitter.update({ status }, (err, data) => {
      if (err) {
        reject(data);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = (context, myTimer) => {
  const timeStamp = new Date().toISOString();

  gsjson({ spreadsheetId: googleSpreadsheetId })
    .then((data) => {
      const currentItems = getItemsForDate(data, new Date());

      if (currentItems.length > 0) {
        var randomIndex = Math.floor(Math.random() * currentItems.length);
        var statusText = currentItems[randomIndex].content;
        sendTweet(statusText)
          .then(() => context.log("Tweet (" + statusText + ") has been sent.", timeStamp))
          .catch((e) => {
            context.log("Error while sending tweet: ");
            context.log(e);
          });
      } else {
        context.log("No tweet found.", timeStamp);
      }
    })
    .catch(function (err) {
      console.error(err.message);
      console.error(err.stack);
    });;
};