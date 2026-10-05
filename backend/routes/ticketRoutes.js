import express from "express";
import {
  getTicket,
  createTicket,
  updateTicketStatus,
  deleteTicket,
} from "../utils/ticketControllers.js";
import { authorization, requireRole } from "../middleware/authorization.js";

const ticketRoutes = express.Router();

ticketRoutes.get("/tickets", authorization, getTicket);
ticketRoutes.post("/ticket/create", authorization, createTicket);
ticketRoutes.patch("/tickets/:id/status", authorization, requireRole("admin"), updateTicketStatus);
ticketRoutes.delete("/ticket/delete/:id", authorization, deleteTicket);

export default ticketRoutes;

