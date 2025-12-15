import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import "chart.js/auto";
import { FaMale, FaFemale } from "react-icons/fa";

import Card from "../components/Card";
import Loader from "../components/Loader";
import { request } from "../services/api";
import { connectSocket, disconnectSocket } from "../socket/socket";
import "../styles/dashboard.css";

import { Chart } from "chart.js";

Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = "circle";
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.boxHeight = 8;
Chart.defaults.plugins.legend.position = "top";
Chart.defaults.plugins.legend.align = "end";
Chart.defaults.plugins.legend.labels.color = "#6b7280";


export default function Dashboard() {
  const navigate = useNavigate();

   /* ================= SIDEBAR ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  /* ================= HEADER INTERACTION STATES ================= */
  const [showMallDropdown, setShowMallDropdown] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* ================= DASHBOARD STATES ================= */
  const [summary, setSummary] = useState({
    occupancy: 734,
    footfall: 2436,
    dwellAvg: "08",
  });

  const [occupancySeries, setOccupancySeries] = useState({
    labels: [],
    values: [],
  });

  const [demographicsSeries, setDemographicsSeries] = useState({
    labels: [],
    male: [],
    female: [],
  });

  const [pieData, setPieData] = useState({
    male: 0,
    female: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const dwell = await request("/analytics/dwell", { method: "POST" });
      const footfall = await request("/analytics/footfall", { method: "POST" });
      const occupancy = await request("/analytics/occupancy", { method: "POST" });
      const demographics = await request("/analytics/demographics", {
        method: "POST",
      });

      if (!mounted) return;

      setLoading(false);

      if (!dwell.error) {
        setSummary((s) => ({
          ...s,
          dwellAvg: dwell.data?.average || 0,
        }));
      }

      if (!footfall.error) {
        setSummary((s) => ({
          ...s,
          footfall: footfall.data?.today || 0,
        }));
      }

      if (!occupancy.error) {
        setOccupancySeries({
          labels: occupancy.data?.labels || [],
          values: occupancy.data?.values || [],
        });

        setSummary((s) => ({
          ...s,
          occupancy: occupancy.data?.current || 0,
        }));
      }

      if (!demographics.error) {
        setDemographicsSeries({
          labels: demographics.data?.labels || [],
          male: demographics.data?.male || [],
          female: demographics.data?.female || [],
        });

        setPieData({
          male: demographics.data?.total_male || 0,
          female: demographics.data?.total_female || 0,
        });
      }
    }

    load();

    const socket = connectSocket();

    socket?.on("live_occupancy", (payload) => {
      setSummary((s) => ({
        ...s,
        occupancy: payload.current,
      }));
    });

    return () => {
      mounted = false;
      disconnectSocket();
    };
  }, []);

  /* ================= CHART CONFIGS ================= */
  const occupancyChart = {
    labels: occupancySeries.labels,
    datasets: [
      {
        label: "Occupancy Count",
        data: occupancySeries.values,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const demographicsChart = {
    labels: demographicsSeries.labels,
    datasets: [
      {
        label: "Male Count",
        data: demographicsSeries.male,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointStyle: "circle",
      },
      {
        label: "Female Count",
        data: demographicsSeries.female,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointStyle: "circle",
      },
    ],
  };
  

  


  const pieChart = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [pieData.male, pieData.female],
        borderWidth: 2,
      },
    ],
  };

  

  return (
    <div className="dash-wrapper">
      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
            <div className= "sidebar-top">
            <h3 className="menu-title">Koudspot</h3>
          <button
             className="hamburger-btn"
             onClick={() => setSidebarOpen((p) => !p)}
               >
                  ☰
             </button>
         
         
             </div>
                     
          <div className="sidebar-links">
            <div className="sidebar-item active">Overview</div>
            <div
              className="sidebar-item"
              onClick={() => navigate("/entries")}
            >
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
              className="icon-btn mobile-hamburger"
                onClick={() => setSidebarOpen((p) => !p)}
              >
               ☰
             </button>
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

        {/* OCCUPANCY */}
        <h3 className="section-heading">Occupancy</h3>

        {loading ? (
          <div className="center">
            <Loader />
          </div>
        ) : (
          <div className="summary-container">
            <Card className="summary-box">
              <p className="sb-title">Live Occupancy</p>
              <h2 className="sb-value">{summary.occupancy}</h2>
            </Card>

            <Card className="summary-box">
              <p className="sb-title">Today’s Footfall</p>
              <h2 className="sb-value">{summary.footfall}</h2>
            </Card>

            <Card className="summary-box">
              <p className="sb-title">Avg Dwell Time</p>
              <h2 className="sb-value">
                {summary.dwellAvg.toString().padStart(2, "0")} min
              </h2>
            </Card>
          </div>
        )}

        {!loading && (
          <>
            <Card className="chart-block big-chart">
              <h4 className="chart-title">Overall Occupancy</h4>
              <Line data={occupancyChart} />
            </Card>

            <h3 className="section-heading mt-30">Demographics</h3>

            <div className="demographics-grid">
              <Card className="demo-pie-card">
                <h4 className="chart-title">Chart of Demographics</h4>
                <Pie data={pieChart} />
                {/* 👇 CUSTOM LEGEND (NOT Chart.js) */}
               <div className="demo-legend">
                <div className="legend-item">
                 <FaMale className="male-icon" />
                  <span>{pieData.male}% Males</span>
                   </div>

                <div className="legend-item">
                 <FaFemale className="female-icon" />
                <span>{pieData.female}% Females</span>
                 </div>
                 </div>
              </Card>

              <Card className="chart-block">
                <h4 className="chart-title">Demographics Analysis</h4>
                <Line data={demographicsChart}  />

              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
