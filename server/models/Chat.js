import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    role: { type: String, enum: ["user", "ai"], required: true },
    text: String,
    imageUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
