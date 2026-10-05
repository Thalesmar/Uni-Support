// src/Components/MainContent.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import { HiOutlineCalendar, HiOutlineUser } from "react-icons/hi2";
import { FaRegClock, FaCheckCircle, FaRegPaperPlane } from "react-icons/fa";
import { FiChevronDown, FiSliders } from "react-icons/fi";
import { MdInfo } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import { API_URL, apiFetch } from "../api";

const HardwareIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.15em" width="1.15em">
    <rect width="20" height="14" x="2" y="3" rx="2"></rect>
    <line x1="8" x2="16" y1="21" y2="21"></line>
    <line x1="12" x2="12" y1="17" y2="21"></line>
  </svg>
);

const NetworkIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1.15em" width="1.15em">
    <path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.55-.29 22.9l60.25 58.73c6.31 6.15 16.38 6.16 22.75.03 129.58-124.6 339.4-124.71 469.2 0 6.37 6.13 16.44 6.12 22.75-.03l60.25-58.73c6.5-6.35 6.37-16.74-.29-22.9zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.6-131.62c-111.75-104.97-293.45-104.97-405.2 0-6.42 6.03-6.55 16.27-.3 22.48l60.27 59.95c6.32 6.29 16.47 6.3 22.84.03 62.06-61.08 177.37-61.07 239.44 0 6.37 6.27 16.52 6.26 22.84-.03l60.27-59.95c6.25-6.21 6.12-16.45-.3-22.48z"></path>
  </svg>
);

const SoftwareIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.15em" width="1.15em">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const AccountIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.15em" width="1.15em">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const options = [
  { value: "hardware", label: "Hardware", icon: <HardwareIcon /> },
  { value: "network", label: "Network", icon: <NetworkIcon /> },
  { value: "software", label: "Software", icon: <SoftwareIcon /> },
  { value: "account", label: "Account/Access", icon: <AccountIcon /> },
];

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Just now";
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};

const MainTicketContent = ({ tickets = [], setTickets, currentUser = null }) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [ticketValue, setTicketValue] = useState("");
  const [priority, setPriority] = useState("high");
  const [description, setDescription] = useState("");
  const [activeAllTickets, setActiveAllTickets] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  const selectRef = useRef(null);
  const isAdmin = currentUser?.role === "admin";

  const fetchTickets = useCallback(async () => {
    try {
      const response = await apiFetch(`${API_URL}/tickets`);

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const responseData = await response.json();
      const ticketList =
        responseData.tickets ||
        responseData.data ||
        (Array.isArray(responseData) ? responseData : []);

      setTickets(ticketList);
    } catch (error) {
      console.error("Failed to load tickets", error);
    }
  }, [setTickets, navigate]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketValue.trim() || !description.trim() || isSubmitting) return;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setActionError("");

    try {
      const response = await apiFetch(`${API_URL}/ticket/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: ticketValue.trim(),
          category: selectedOption.value,
          priority,
          description: description.trim(),
          status: "open",
        }),
      });

      const createdTicket = await response.json();

      if (!response.ok) {
        setFormError(createdTicket?.message || "Could not create ticket.");
        return;
      }

      if (createdTicket.newTicket) {
        setTickets((prev) => [createdTicket.newTicket, ...prev]);
      }

      setTicketValue("");
      setDescription("");
      setPriority("high");
      setSelectedOption(options[0]);
    } catch (error) {
      console.error("Error creating ticket:", error);
      setFormError("Network error. Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setOpenStatusMenuId(null);
    setActionError("");

    const previousTickets = [...tickets];
    setTickets((prev) =>
      prev.map((t) => ((t._id || t.id) === ticketId ? { ...t, status: newStatus } : t))
    );

    try {
      const response = await apiFetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setActionError(errorData?.message || "Failed to update status on server.");
        setTickets(previousTickets);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      setActionError("Network error while updating status.");
      setTickets(previousTickets);
    }
  };

  const handleDeleteTicket = async (id) => {
    setActionError("");

    try {
      const response = await apiFetch(`${API_URL}/ticket/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setTickets((prev) => prev.filter((ticket) => (ticket._id || ticket.id) !== id));
      } else {
        const data = await response.json();
        setActionError(data?.message || "Unable to delete ticket.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setActionError("Network error while deleting ticket.");
    }
  };

  const filteredTickets = tickets.filter((item) => {
    if (activeAllTickets === "All") return true;
    return item.status?.toLowerCase() === activeAllTickets.toLowerCase();
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  return (
    <section className="main-layout">
      {/* Sidebar Form */}
      <aside className="sidebar">
        <div className="sidebar-body">
          <div className="new-ticket-header">
            <div className="new-ticket-icon-wrapper">
              <HiPlus className="new-ticket-icon" />
            </div>
            <div className="new-ticket-text">
              <h2>Create New Ticket</h2>
              <p>Report an issue and get help from our IT team.</p>
            </div>
          </div>

          <form className="new-ticket-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Title <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="text-input"
                placeholder="Enter a short and clear title..."
                value={ticketValue}
                onChange={(e) => setTicketValue(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <div className="custom-select-wrapper" ref={selectRef}>
                <button
                  type="button"
                  className={`custom-select-trigger ${isOpen ? "open" : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="selected-value">
                    <span className="option-icon">{selectedOption.icon}</span>
                    <span>{selectedOption.label}</span>
                  </div>
                  <FiChevronDown className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
                </button>

                {isOpen && (
                  <ul className="custom-options">
                    {options.map((item) => (
                      <li
                        key={item.value}
                        className={`custom-option ${selectedOption.value === item.value ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedOption(item);
                          setIsOpen(false);
                        }}
                      >
                        <span className="option-icon">{item.icon}</span>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Priority <span className="required-star">*</span>
              </label>
              <div className="priority-radio-group">
                <label className={`priority-card high ${priority === "high" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={priority === "high"}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <span className="priority-dot-indicator red-dot"></span>
                  <span>High</span>
                </label>

                <label className={`priority-card medium ${priority === "medium" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={priority === "medium"}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <span className="priority-dot-indicator yellow-dot"></span>
                  <span>Medium</span>
                </label>

                <label className={`priority-card low ${priority === "low" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={priority === "low"}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <span className="priority-dot-indicator gray-dot"></span>
                  <span>Low</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span className="required-star">*</span>
              </label>
              <div className="textarea-wrapper">
                <textarea
                  className="textarea-input"
                  rows="5"
                  maxLength="1000"
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <span className="char-counter">{description.length}/1000</span>
              </div>
            </div>

            {formError && <p className="form-error-text">{formError}</p>}

            <button className="submit-ticket-btn" type="submit" disabled={isSubmitting}>
              <FaRegPaperPlane className="submit-icon" />
              <span>{isSubmitting ? "Submitting..." : "Submit Ticket"}</span>
            </button>
          </form>

          <div className="help-section">
            <div className="help-icon-wrapper">
              <MdInfo className="info-icon" />
            </div>
            <div className="info-text">
              <h3>Need urgent help?</h3>
              <p>
                Contact Helpdesk at <a href="tel:+212537123456">+212 5 37 12 34 56</a>.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Ticket Display */}
      <main className="main-content-panel">
        <section className="tickets-container">
          <div className="tickets-header-bar">
            <div className="filter-header-left">
              <div className="filter-tabs-wrapper">
                <button
                  className={`filter-tab-btn ${activeAllTickets === "All" ? "active" : ""}`}
                  onClick={() => setActiveAllTickets("All")}
                >
                  All ({tickets.length})
                </button>
                <button
                  className={`filter-tab-btn ${activeAllTickets === "open" ? "active" : ""}`}
                  onClick={() => setActiveAllTickets("open")}
                >
                  Open ({tickets.filter((t) => t.status?.toLowerCase() === "open").length})
                </button>
                <button
                  className={`filter-tab-btn ${activeAllTickets === "in progress" ? "active" : ""}`}
                  onClick={() => setActiveAllTickets("in progress")}
                >
                  In Progress ({tickets.filter((t) => t.status?.toLowerCase() === "in progress").length})
                </button>
                <button
                  className={`filter-tab-btn ${activeAllTickets === "resolved" ? "active" : ""}`}
                  onClick={() => setActiveAllTickets("resolved")}
                >
                  Resolved ({tickets.filter((t) => t.status?.toLowerCase() === "resolved").length})
                </button>
              </div>

              <span className={`role-badge ${isAdmin ? "admin" : "client"}`}>
                {isAdmin ? "🛡️ Admin View: All System Tickets" : "👤 Client View: My Tickets"}
              </span>
            </div>

            <div className="sort-dropdown-container">
              <FiSliders className="sort-icon" />
              <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <FiChevronDown className="sort-chevron" />
            </div>
          </div>

          {actionError && (
            <div className="action-error-alert">
              <span>{actionError}</span>
              <button onClick={() => setActionError("")}>✕</button>
            </div>
          )}

          <div className="every-tickets">
            {sortedTickets.length === 0 ? (
              <div className="no-tickets">
                <p>No tickets found in this section.</p>
              </div>
            ) : (
              <div className="tickets-list">
                {sortedTickets.map((ticket) => {
                  const ticketId = ticket._id || ticket.id;
                  const cat = ticket.category?.toLowerCase() || "";
                  const prio = ticket.priority?.toLowerCase() || "medium";
                  const status = ticket.status?.toLowerCase() || "open";

                  const canDelete =
                    isAdmin ||
                    (currentUser &&
                      (ticket.author === currentUser.username || ticket.userId === currentUser.id));

                  return (
                    <article key={ticketId} className="ticket-card">
                      <div className={`ticket-type-icon ${cat.includes("account") ? "account" : cat}`}>
                        {cat === "hardware" && <HardwareIcon />}
                        {cat === "network" && <NetworkIcon />}
                        {cat === "software" && <SoftwareIcon />}
                        {cat.includes("account") && <AccountIcon />}
                      </div>

                      <div className="ticket-main-info">
                        <h3 className="ticket-title">{ticket.title}</h3>

                        <div className="ticket-badges-row">
                          <span className={`badge category-badge ${cat.includes("account") ? "account" : cat}`}>
                            {ticket.category}
                          </span>
                          <span className={`badge priority-badge ${prio}`}>
                            {prio.toUpperCase()}
                          </span>
                        </div>

                        <p className="ticket-description">{ticket.description}</p>

                        <div className="ticket-meta-row">
                          <span className="meta-item">
                            <HiOutlineCalendar className="meta-icon" />
                            Created {formatRelativeTime(ticket.createdAt)}
                          </span>
                          <span className="meta-item-separator">|</span>
                          <span className="meta-item">
                            <HiOutlineUser className="meta-icon" />
                            by {ticket.author || currentUser?.username || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="ticket-actions">
                        {canDelete && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteTicket(ticketId)}
                          >
                            <BsTrash3 className="delete-icon" />
                            <span>Delete</span>
                          </button>
                        )}

                        <div className="status-pill-container">
                          {isAdmin ? (
                            <button
                              type="button"
                              className={`status-pill ${status.replace(" ", "-")}`}
                              onClick={() =>
                                setOpenStatusMenuId(openStatusMenuId === ticketId ? null : ticketId)
                              }
                            >
                              <span className="status-label">{status}</span>
                            </button>
                          ) : (
                            <div className={`status-pill ${status.replace(" ", "-")} read-only`}>
                              <span className="status-label">{status}</span>
                            </div>
                          )}

                          {openStatusMenuId === ticketId && (
                            <div className="status-menu">
                              <button onClick={() => handleStatusChange(ticketId, "open")}>Open</button>
                              <button onClick={() => handleStatusChange(ticketId, "in progress")}>In Progress</button>
                              <button onClick={() => handleStatusChange(ticketId, "resolved")}>Resolved</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </section>
  );
};

export default MainTicketContent;