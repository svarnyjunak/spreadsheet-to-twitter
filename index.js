const _ = require("lodash");

const keys = {
  "consumer_key": process.env.CONSUMER_KEY,
  "consumer_secret": process.env.CONSUMER_SECRET,
  "access_token_key": process.env.ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
};

const dataUrl = process.env.URL;

function getContent(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? require("https") : require("http");
    const request = lib.get(url, (response) => {

      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed to load page, status code: " + response.statusCode));
      }

      const body = [];
      response.on("data", (chunk) => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });

    request.on("error", (err) => reject(err))
  })
}

function extractDataFromSpreadSheet(spreadsheet) {

  // extract data and remove header row
  var entries = spreadsheet.feed.entry
    .map((e) => {
      return {
        row: e.title.$t.substring(1),
        content: e.content.$t
      }
    })
    .filter((e) => e.row != 1)

  //group by row number
  var rows = _.values(_.groupBy(entries, (e) => e.row));

  // create objects
  return rows.map((e) => {
    return {
      day: Number(e[0].content),
      month: Number(e[1].content),
      content: e[2].content
    }
  });
}

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
      if(err) {
        reject(data);
      } else {
        resolve(data);
      }    
    });
  });
}

module.exports = (context, myTimer) => {
  const timeStamp = new Date().toISOString();

  getContent(dataUrl)
  .then((content) => {
    const data = extractDataFromSpreadSheet(JSON.parse(content));
    const currentItems = getItemsForDate(data, new Date());

    if (currentItems.length > 0) {
      var randomIndex = Math.floor(Math.random() * currentItems.length);
      var statusText = currentItems[randomIndex].content;
      sendTweet(statusText)
      .then(() => context.log("Tweet (" + statusText + ") has been sent.", timeStamp))
      .catch((e) => {
        context.log("Error while sending tweet: " );
        context.log(e);
      });
    } else {
      context.log("No tweet found.", timeStamp);
    }
  })
  .catch((error) => { context.log(error)});

  context.log("Done.", timeStamp);
  context.done();
};