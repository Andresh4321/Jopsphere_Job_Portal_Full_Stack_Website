import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { SiteHeader } from "../../components/seeker_dashboard/site-header";
import { SiteFooter } from "../../components/seeker_dashboard/site-footer";
import {
  SeekerDashboard,
  DEFAULT_SEEKER_DASHBOARD_PROPS,
} from "../../components/seeker_dashboard/seeker-dashboard";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

export default function SeekerDashboardPage() {
  // Swap this for a real fetch (this can become an async server component,
  // e.g. `const data = await getSeekerDashboard(userId)`) once it's wired
  // up to your API. The shape matches `SeekerDashboardProps`.
  const data = DEFAULT_SEEKER_DASHBOARD_PROPS;

  return (
    <div
      className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] font-sans text-neutral-900 antialiased`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <SiteHeader active="seeker" />
      <SeekerDashboard {...data} />
      <SiteFooter />
    </div>
  );
}