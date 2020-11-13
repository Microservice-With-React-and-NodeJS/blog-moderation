const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

//create CommentModerated event + send it to event-bus
//this watch for any request going to our events end point. we receive an event from event broker
app.post("/events", async (req, res) => {
  //pull out type and data of a post via req.body
  const { type, data } = req.body;
  //it it is a comment related, we will do the data moderation part here
  if (type === "CommentCreated") {
    //approve or rejact a comment depending on the presence of "orange"
    const status = data.content.includes("orange") ? "rejected" : "approved";
    //after having the status, mit the CommentModerated event, for that make a post req to event bus including the comments with the newly updated status

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Moderation Listening to 4003");
});

// a well descripbed documentation is required to remember what properties are ther in each events in different services.
