import express from "express";
import auth from "../middleware/auth.js";
import Chat from "../models/Chat.js";
import Conversation from "../models/Conversation.js";

const router = express.Router();


router.post("/new", auth, async (req, res) => {
  const chat = await Conversation.create({
    userId: req.user.id
  });
  res.json(chat);
});


router.get("/conversations", auth, async (req, res) => {
  const chats = await Conversation.find({ userId: req.user.id })
    .sort({ updatedAt: -1 });
  res.json(chats);
});


router.get("/:id", auth, async (req, res) => {
  const messages = await Chat.find({ conversationId: req.params.id });
  res.json(messages);
});


router.post("/message", auth, async (req, res) => {
  const msg = await Chat.create(req.body);

  await Conversation.findByIdAndUpdate(req.body.conversationId, {
    updatedAt: new Date()
  });

  res.json(msg);
});


export default router;
