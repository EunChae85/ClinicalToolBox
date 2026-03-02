# Clinical ToolBox

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/start/deploy?repository=https://github.com/EunChae85/ClinicalToolBox)

**Essential CRA & CRC Productivity Suite**

One-stop toolkit for clinical trial professionals (CRA/CRC) to handle daily calculations, visit scheduling, and compliance monitoring with precision and ease.

## 🚀 Key Features

- **Unit Converter**: Mass, length, and temperature conversions tailored for clinical data.
- **Dose & Dilution**: Rapidly calculate weight-based dosing and concentration volumes.
- **Renal Function**: eGFR (CKD-EPI 2021) and CrCl (Cockcroft-Gault) calculators.
- **Visit Window Scheduler**: Generate full visit schedules with target dates and window ranges.
- **Compliance Monitoring**: Automated compliance percentage calculation with missed dose adjustments.
- **Universal Export**: Export any screen's results to **PDF**, **Excel**, or **CSV** with one click.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Design System**: Shadcn/UI
- **i18n**: Next-intl (Korean & English Support)
- **Utilities**: Lucide Icons, Date-fns, JsPDF, SheetJS

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
git clone https://github.com/EunChae85/ClinicalToolBox.git
cd ClinicalToolBox
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application locally.

## 🌐 Deployment on Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize.
4. Search for `ClinicalToolBox`.
5. Keep default build settings (`next build` / `.next`).
6. Click **Deploy ClinicalToolBox**.

## 📝 License

This project is licensed under the MIT License.
