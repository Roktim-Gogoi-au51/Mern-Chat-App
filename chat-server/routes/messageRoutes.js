const router = require('express').Router();
const authenticate = require('../middleware/auth');

const Messages = require('../models/messagesModel');

router.post('/addMessage',authenticate, async(req,res)=>{
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
          message: { text: message },
          users: [from, to],
          sender: from,
        });
    
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
      } catch (err) {
        console.log(err.message)
      }
})

router.post('/getMessages',authenticate ,async(req,res)=>{
  try {
    console.log(req.body)
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (err) {
    console.log(err.message);
  }
})

module.exports = router;