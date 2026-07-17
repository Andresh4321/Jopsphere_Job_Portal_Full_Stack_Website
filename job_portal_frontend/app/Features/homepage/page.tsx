"use client";
import Link from "next/link";
import React, { useState } from "react";
import { ROUTES } from "../../../lib/route";
const JopsphereIcon = () => (
  <img src="/logo.png" alt="Jopsphere" className="w-[38px] h-[38px] rounded-[10px] object-contain" />
);

const categories = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Hospitality",
  "Data",
  "Finance",
  "Operations",
];

const steps = [
  {
    num: "1",
    label: "STEP 1",
    title: "Create your profile",
    desc: "OTP signup in under a minute. No passwords.",
  },
  {
    num: "2",
    label: "STEP 2",
    title: "Browse verified jobs",
    desc: "Every employer is verified. Salary is shown.",
  },
  {
    num: "3",
    label: "STEP 3",
    title: "Apply with confidence",
    desc: "Track every application and get a decision.",
  },
];

const filters = [
  { label: "Remote", bg: "#F4F4F5", color: "#444444" },
  { label: "NPR 40k+", bg: "#EAF8F0", color: "#148A50" },
  { label: "Entry level", bg: "#F4F4F5", color: "#444444" },
  { label: "Verified only", bg: "#F0ECFF", color: "#6D4AFF" },
  { label: "Walk-in hiring", bg: "#FFF4D8", color: "#8A5A00" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E6E6E6",
        height: 72,
        display: "flex",
        alignItems: "center",
        padding: "0 96px",
        gap: 32,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
          <JopsphereIcon />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#171717" }}>Jopsphere</span>
        </div>
        <nav style={{ display: "flex", gap: 32, flex: 1 }}>
          {[
            { label: "Find Jobs", href: ROUTES.findJobs },
            { label: "Salary Explorer", href: ROUTES.salaryExplorer },
            { label: "Companies", href: ROUTES.companyList },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{ fontSize: 15, color: "#737373", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href={ROUTES.register} style={{ fontSize: 15, color: "#171717", textDecoration: "none" }}>Sign up</Link>
          <Link href={ROUTES.login}>
  <button
    style={{
      background: "#6D4AFF",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    Log In
  </button>
</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: "#fff",
        padding: "63px 96px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", right: 150, top: 0,
          width: 420, height: 420, borderRadius: "50%",
          background: "#F0ECFF", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", left: 0, bottom: -60,
          width: 340, height: 340, borderRadius: "50%",
          background: "#F8F5FF", zIndex: 0,
        }} />

        <div style={{ display: "flex", gap: 48, alignItems: "flex-start", position: "relative", zIndex: 1 }}>

          {/* Left copy */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: "#F0ECFF", borderRadius: 17,
              padding: "6px 16px", marginBottom: 32,
              fontSize: 13, fontWeight: 700, color: "#6D4AFF",
            }}>
              ✓ Verified employers only
            </div>

            <h1 style={{
              fontSize: 68, fontWeight: 800, color: "#171717",
              lineHeight: 1.05, margin: "0 0 20px",
            }}>
              Find real jobs.<br />Get real responses.
            </h1>

            <p style={{ fontSize: 19, color: "#737373", lineHeight: 1.6, margin: "0 0 40px", maxWidth: 560 }}>
              Nepal's first verified job portal with guaranteed employer responses —
              no ghosting, no fake listings, salary always disclosed.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
              <Link href={ROUTES.findJobs} style={{
                background: "#6D4AFF", color: "#fff", border: "none",
                borderRadius: 10, padding: "12px 28px",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                textDecoration: "none", display: "inline-block",
              }}>Find Jobs</Link>
              <Link href={ROUTES.register} style={{
                background: "#fff", color: "#171717",
                border: "1px solid #D4D4D4",
                borderRadius: 10, padding: "12px 28px",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                textDecoration: "none", display: "inline-block",
              }}>Post a Job</Link>
            </div>

            {/* Stats bar */}
            <div style={{
              background: "#fff", border: "1px solid #E6E6E6",
              borderRadius: 20, padding: "0 32px",
              display: "flex", alignItems: "center",
              width: "fit-content",
            }}>
              {[
                { value: "2,400+", label: "verified employers" },
                { value: "94%", label: "response rate" },
                { value: "2 days", label: "Avg reply in" },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <div style={{ width: 1, height: 60, background: "#E6E6E6", margin: "0 32px" }} />
                  )}
                  <div style={{ padding: "22px 0" }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: "#171717" }}>{stat.value}</div>
                    <div style={{ fontSize: 14, color: "#737373" }}>{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right search card */}
          <div style={{
            width: 485, flexShrink: 0,
            background: "#fff", border: "1px solid #E6E6E6",
            borderRadius: 26, padding: "32px",
          }}>
            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "#FAFAFA", border: "1px solid #E6E6E6",
              borderRadius: 14, padding: "0 12px 0 16px",
              marginBottom: 24,
            }}>
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1, border: "none", background: "transparent",
                  fontSize: 15, color: "#171717", outline: "none",
                  height: 52, fontFamily: "inherit",
                }}
              />
              <button style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#6D4AFF", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="2" />
                  <path d="M11 11l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Popular filters */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#171717", marginBottom: 12 }}>
              Popular filters
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {filters.map((f) => (
                <button
                  key={f.label}
                  style={{
                    background: f.bg, color: f.color,
                    border: "none", borderRadius: 17,
                    padding: "8px 16px", fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Mini job card */}
            <div style={{
              background: "#FAFAFA", border: "1px solid #E6E6E6",
              borderRadius: 16, padding: "18px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#171717", marginBottom: 6 }}>
                  Frontend Engineer
                </div>
                <div style={{ fontSize: 13, color: "#737373" }}>
                  Leapfrog Technology · Kathmandu
                </div>
              </div>
              <div style={{
                background: "#F0ECFF", borderRadius: 14,
                padding: "6px 14px", fontSize: 12,
                fontWeight: 700, color: "#6D4AFF",
                whiteSpace: "nowrap",
              }}>
                91% fit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Categories ── */}
      <section style={{ padding: "56px 96px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#171717", margin: 0 }}>
            Featured categories
          </h2>
          <Link href={ROUTES.findJobs} style={{
            background: "#fff", border: "1px solid #D4D4D4",
            borderRadius: 10, padding: "10px 22px",
            fontSize: 14, fontWeight: 700, color: "#171717",
            cursor: "pointer", textDecoration: "none",
          }}>
            Browse all jobs
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={{
                background: "#fff", border: "1px solid #E6E6E6",
                borderRadius: 18, padding: "28px 32px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", textAlign: "left",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#6D4AFF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E6E6E6")}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: "#171717" }}>{cat}</span>
              <span style={{ fontSize: 22, color: "#6D4AFF" }}>›</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── How Jopsphere Works ── */}
      <section style={{ padding: "72px 96px" }}>
        <h2 style={{
          fontSize: 34, fontWeight: 800, color: "#171717",
          textAlign: "center", marginBottom: 40,
        }}>
          How Jopsphere works
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: "#fff", border: "1px solid #E6E6E6",
                borderRadius: 20, padding: "32px",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: "#F0ECFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "#6D4AFF",
                marginBottom: 24,
              }}>
                {step.num}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700, letterSpacing: 1.4,
                color: "#737373", marginBottom: 10,
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: 21, fontWeight: 700, color: "#171717", marginBottom: 10 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 14, color: "#737373", lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#fff", borderTop: "1px solid #E6E6E6",
        padding: "40px 96px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#171717", marginBottom: 6 }}>Jopsphere</div>
          <div style={{ fontSize: 14, color: "#737373" }}>Nepal's first verified job portal.</div>
        </div>
        <nav style={{ display: "flex", gap: 32 }}>
          {["How it works", "FAQ", "Privacy", "Contact"].map((item) => (
            <a key={item} href="#" style={{ fontSize: 14, color: "#737373", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#171717")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#737373")}
            >{item}</a>
          ))}
        </nav>
        <div style={{ fontSize: 14, color: "#737373" }}>© 2026 Jopsphere. Made in Nepal.</div>
      </footer>

    </div>
  );
}