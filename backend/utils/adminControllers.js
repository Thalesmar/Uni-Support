import User from "../models/userSchema.js";
import Ticket from "../models/ticketSchema.js";


export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalTickets, openTickets, resolvedTickets },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("+password");

    if (!allUsers) {
      return res.status(404).json({ message: "Users are not found" });
    }

    res.status(200).json({ message: "users imported", allUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // "admin" or "user"

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};