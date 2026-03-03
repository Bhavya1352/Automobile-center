# AutoSphere - Premium Automobile Service Center

![AutoSphere Hero](https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200)

AutoSphere is a high-end, premium frontend web application tailored for advanced automobile service centers, luxury garages, and performance tuning shops. Designed with a sleek, dark glassmorphism aesthetic, it offers a distinct, modern user experience.

## ✨ Key Features

- **Dual-Themed Homepages**
  - **Home 1 (Precision Tech):** Focused on modern telemetry, ECU tuning, and high-performance digital diagnostics.
  - **Home 2 (Heritage Mastery):** Focused on classic restorations, mechanical perfection, and legacy craftsmanship.
- **Dedicated Dashboards**
  - **User Dashboard:** For customers to manage their vehicles, track real-time service progress, view history, and download invoices. Layout features horizontal tab navigation.
  - **Admin Dashboard:** A full command center for the workshop admin to monitor live service queues, bay status, active technicians, and revenue.
- **RTL & LTR Support:** Complete bidirectional layout support. Click the Globe icon in the navbar to seamlessly switch the entire layout from Left-to-Right to Right-to-Left (perfect for Arabic/Hebrew localization).
- **Fully Responsive UI:** Flawless scaling from mobile devices (360px) to ultra-wide desktop monitors, ensuring tables and tab bars scroll horizontally cleanly without breaking layouts.
- **Premium Aesthetics:** Constructed entirely with a dark navy/emerald color palette and immersive glassmorphic (`backdrop-blur`) overlays. Smooth page transitions powered by Framer Motion.

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (v3)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Routing:** React Router DOM

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js installed on your machine.
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/Bhavya1352/Automobile-center.git
   ```
2. Navigate to the project directory
   ```bash
   cd Automobile-center
   ```
3. Install NPM packages
   ```bash
   npm install
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` (or the port provided by Vite).

## 📁 Project Structure

```
src/
├── components/       # Reusable UI elements (Navbar, Footer, Hero, etc.)
├── context/          # React Context providers (LanguageContext for RTL/LTR)
├── pages/            # Main application pages
│   ├── Home1.tsx        # Tech-focused landing
│   ├── Home2.tsx        # Heritage-focused landing
│   ├── About.tsx        # Company information
│   ├── Contact.tsx      # Contact form and details
│   ├── GetStarted.tsx   # Registration/Login flow
│   ├── UserDashboard.tsx# Customer portal
│   └── AdminDashboard.tsx# Workshop management portal
├── App.tsx           # Main application routing & layout configuration
├── index.css         # Global styles and Tailwind directives
└── main.tsx          # Application entry point
```

## 🌐 Layout Features

- **Automated Footer Management:** The `Layout.tsx` component automatically handles footer visibility. It hides the footer on Dashboard pages to prevent layout clustering with fixed elements, and shows it on public-facing marketing pages.
- **Sticky Tab Navigation:** Instead of traditional sidebars (which waste horizontal space on smaller screens), both dashboards utilize sticky horizontal scrolling tab bars for a cleaner mobile and desktop experience.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with focus on mechanical perfection and digital excellence.*
