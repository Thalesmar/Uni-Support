import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "category required"],
      enum: ["hardware", "network", "software", "account"],
      default: "hardware",
    },
    priority: {
      type: String,
      required: false,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      required: false,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
    author: {
      type: String,
      default: "Yassine",
    },
    // Reference the user who created this ticket.
    // This allows us to filter tickets by owner or look up user information.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Tickets = mongoose.model("Ticket", ticketSchema);

export default Tickets;
