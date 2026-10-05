import Tickets from "../models/ticketSchema.js";
import User from '../models/userSchema.js'

const allowedStatuses = ["open", "in progress", "resolved"];

export const getTicket = async (req, res) => {
  try {
    let query = {};

    if (req.user && req.user.role !== "admin") {
      const user = await User.findById(req.user.userId).select("username");
      if (user) {
        query = {
          $or: [
            { userId: req.user.userId },
            { author: user.username },
          ],
        };
      } else {
        query = { userId: req.user.userId };
      }
    }

    const tickets = await Tickets.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error("Error getting tickets:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let author = "Guest";
    let userId = null;

    if (req.user?.userId) {
      userId = req.user.userId;
      const user = await User.findById(req.user.userId).select("username");
      if (user) author = user.username;
    }

    const newTicket = await Tickets.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      category: category || "hardware",
      priority: priority || "medium",
      status: status || "open",
      author,
      userId,
    });

    return res.status(201).json({ success: true, newTicket });
  } catch (err) {
    console.error("Error creating ticket:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const ticket = await Tickets.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true },
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner =
      req.user &&
      ((ticket.userId && ticket.userId.toString() === req.user.userId) ||
        ticket.author === req.user.username);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete this ticket",
      });
    }

    await Tickets.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

