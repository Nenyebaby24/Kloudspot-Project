import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { request } from "../services/api";
import Loader from "../components/Loader";

import "../styles/entries.css";

export default function Entries() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);


  /* ================= HEADER INTERACTION STATES ================= */
  const [showMallDropdown, setShowMallDropdown] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* ================= DATA STATES ================= */
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function load(p = 1) {
    setLoading(true);

    try {
      const res = await request(
        "https://hiring-dev.internal.kloudspot.com/api/analytics/entry-exit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: p,
            page_size: 20,
          }),
        }
      );

      if (res.error) {
        console.error(res.error);
        return;
      }

      setRows(res.data?.results || []);
      setTotalPages(res.data?.total_pages || 1);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <div className="dash-wrapper">
      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="sidebar-inner">
          <div className="sidebar-top">
            <h3 className="menu-title">Koudspot</h3>
          <button
             className="hamburger-btn"
               onClick={() => setSidebarOpen((p) => !p)}
>
                   ☰
               </button>
               
                </div>
           

          <div className="sidebar-links">
            <div
              className="sidebar-item"
              onClick={() => navigate("/dashboard")}
            >
              Overview
            </div>

            <div className="sidebar-item active">
              Crowd Entries
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`dash-main ${sidebarOpen ? "" : "expanded"}`}>

        {/* HEADER */}
        <header className="dash-header">
          {/* LEFT */}
          <div className="header-left">
            <span className="brand-text">Crowd Solutions</span>

            <div className="dropdown-wrapper">
              <button
                className="location-btn"
                onClick={() => setShowMallDropdown((p) => !p)}
              >
                Avenue Mall <span className="chevron">▾</span>
              </button>

              {showMallDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Avenue Mall</div>
                  <div className="dropdown-item">Ikeja City Mall</div>
                  <div className="dropdown-item">Lekki Mall</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="header-right">
            <button
              className="lang-btn"
              onClick={() =>
                setLanguage((l) => (l === "EN" ? "FR" : "EN"))
              }
            >
              {language}
            </button>

            <button
              className="icon-btn"
              onClick={() => alert("No new notifications")}
            >
              🔔
            </button>

            <div className="profile-wrapper">
              <div
                className="profile-avatar"
                onClick={() => setShowProfileMenu((p) => !p)}
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                />
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-item">My Profile</div>
                  <div
                    className="profile-item"
                    onClick={() => navigate("/login")}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SECOND HEADER */}
        <div className="sub-header">
          <h2 className="page-title">Overview</h2>

          <button className="date-filter-btn">
            <span className="calendar-icon">📅</span>
            Today
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="entries-table-wrapper">
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Dwell Time</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, index) => (
                    <tr key={index}>
                      <td className="name-cell">
                        <img
                          src={`https://i.pravatar.cc/32?img=${index + 1}`}
                          alt="avatar"
                          className="avatar"
                        />
                        {r.visitor_name || r.name || "—"}
                      </td>

                      <td>{r.gender || "—"}</td>

                      <td>
                        {r.entry_time
                          ? new Date(r.entry_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td>
                        {r.exit_time
                          ? new Date(r.exit_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      <td>
                        {r.dwell_time
                          ? `${r.dwell_time} min`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} / {totalPages}
              </span>

              <button
                className="btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
