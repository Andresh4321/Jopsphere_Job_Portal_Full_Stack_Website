import React, { useState } from "react";

const KaamIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="12" fill="#6D4AFF" />
    <path d="M11 16h16v14H11V16Z" stroke="white" strokeWidth="2" fill="none" />
    <path
      d="M15 16v-5a4 4 0 0 1 8 0v5"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E6E6E6",
        height: 72,
        display: "flex",
        alignItems: "center",
        padding: "0 96px",
        gap: 32,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
          <KaamIcon />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#171717" }}>Kaam</span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 32, flex: 1 }}>
          {["Find Jobs", "My Applications", "Salary Explorer", "For Employers", "Applicants"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ fontSize: 15, color: "#737373", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#171717")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#737373")}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#" style={{ fontSize: 15, color: "#171717", textDecoration: "none" }}>Sign in</a>
          <button style={{
            background: "#6D4AFF",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}>
            Post a Job
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "48px 96px",
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        justifyContent: "center",
      }}>
        {/* Left decorative cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8, minWidth: 230 }}>
          <div style={{
            background: "#fff",
            border: "1px solid #E6E6E6",
            borderRadius: 20,
            padding: "24px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: "#F0ECFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#6D4AFF",
            }}>
              1
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#171717" }}>OTP signup</div>
              <div style={{ fontSize: 13, color: "#737373", marginTop: 4 }}>No password needed</div>
            </div>
          </div>

          <div style={{
            background: "#F0ECFF",
            borderRadius: 20,
            padding: "24px 20px",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#171717", marginBottom: 10 }}>
              Get started faster
            </div>
            <div style={{ fontSize: 14, color: "#737373", lineHeight: 1.6 }}>
              Create your profile and apply in under a minute.
            </div>
          </div>
        </div>

        {/* Center — Onboarding card */}
        <div style={{ flex: "0 0 544px" }}>
          {/* Step indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#171717" }}>Step 1 of 3</span>
            <span style={{ fontSize: 15, color: "#737373" }}>~1 min</span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 8, background: "#E9E4FF", borderRadius: 4, marginBottom: 28,
          }}>
            <div style={{ height: 8, width: "33.3%", background: "#6D4AFF", borderRadius: 4 }} />
          </div>

          {/* Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #E6E6E6",
            borderRadius: 22,
            padding: "48px 40px",
          }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#171717", margin: "0 0 10px" }}>
              Let's verify it's really you
            </h1>
            <p style={{ fontSize: 15, color: "#737373", margin: "0 0 36px" }}>
              No passwords. We'll send a one-time code.
            </p>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#171717", marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: 44,
                  border: "1px solid #D4D4D4",
                  borderRadius: 8,
                  padding: "0 16px",
                  fontSize: 14,
                  color: "#171717",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6D4AFF")}
                onBlur={(e) => (e.target.style.borderColor = "#D4D4D4")}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 36 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#171717", marginBottom: 8 }}>
                Phone
              </label>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  height: 44,
                  border: "1px solid #D4D4D4",
                  borderRadius: 8,
                  padding: "0 16px",
                  fontSize: 14,
                  color: "#171717",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6D4AFF")}
                onBlur={(e) => (e.target.style.borderColor = "#D4D4D4")}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{
                height: 40, padding: "0 24px",
                border: "1px solid #D4D4D4", borderRadius: 8,
                background: "#fff", fontSize: 14, fontWeight: 600,
                color: "#171717", cursor: "pointer",
              }}>
                Back
              </button>
              <button style={{
                height: 40, padding: "0 24px",
                border: "1px solid #D4D4D4", borderRadius: 8,
                background: "#fff", fontSize: 14, fontWeight: 600,
                color: "#171717", cursor: "pointer",
              }}>
                Browse first
              </button>
              <button style={{
                height: 40, flex: 1,
                border: "none", borderRadius: 8,
                background: "#6D4AFF", fontSize: 14, fontWeight: 700,
                color: "#fff", cursor: "pointer",
              }}>
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Right decorative cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8, minWidth: 240 }}>
          <div style={{
            background: "#fff",
            border: "1px solid #E6E6E6",
            borderRadius: 20,
            padding: "24px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: "#EAF8F0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#148A50",
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#171717" }}>Verified only</div>
              <div style={{ fontSize: 13, color: "#737373", marginTop: 4 }}>Real jobs, real replies</div>
            </div>
          </div>

          <div style={{
            background: "#FFF4D8",
            borderRadius: 20,
            padding: "24px 20px",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#171717", marginBottom: 10 }}>
              Response guarantee
            </div>
            <div style={{ fontSize: 14, color: "#737373", lineHeight: 1.6 }}>
              Track every application with real status updates.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "#fff",
        borderTop: "1px solid #E6E6E6",
        padding: "40px 96px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#171717", marginBottom: 6 }}>Kaam</div>
          <div style={{ fontSize: 14, color: "#737373" }}>Nepal's first verified job portal.</div>
        </div>

        <nav style={{ display: "flex", gap: 32 }}>
          {["How it works", "FAQ", "Privacy", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ fontSize: 14, color: "#737373", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#171717")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#737373")}
            >
              {item}
            </a>
          ))}
        </nav>

        <div style={{ fontSize: 14, color: "#737373" }}>© 2026 Kaam. Made in Nepal.</div>
      </footer>
    </div>
  );
}