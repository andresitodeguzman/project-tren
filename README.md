# Project Tren 🚆  
Track your ride and more.

Project Tren is a web-based app designed to help users track their rides, likely optimized for mobile usage (PWA-ready). The project lives primarily in the `docs/` folder for GitHub Pages compatibility.

---

## 📁 Project Structure

```
project-tren/
├── _config.yml           # GitHub Pages config
├── docs/                 # Main app directory (root for GitHub Pages)
│   ├── _config.yml
│   ├── assets/           # Static assets (images, icons, etc.)
│   ├── CNAME             # Custom domain
│   ├── data.js           # Data layer or seed data
│   ├── DBHelper.js       # Database utility/helper
│   ├── favicon.ico       # App icon
│   ├── index.html        # App entry point
│   ├── index.js          # Main JavaScript file
│   ├── LocationHelper.js # Location-based logic
│   ├── manifest.json     # Web app manifest (PWA support)
│   ├── serviceworker.js  # Service worker (offline support)
│   ├── share.html        # Ride-sharing feature page
│   └── share.js          # JS logic for share.html
├── LICENSE
└── README.md             # You're here!
```

---

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser. To run locally:

### Local Preview

You can serve the project locally using any static file server, for example:

```bash
npx serve docs
```

Or, if using Python:

```bash
cd docs
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deployment

This project is configured to work with **GitHub Pages**. The `docs/` folder is set as the publish directory. Push to your `main` branch and GitHub will host it automatically.

---

## 📌 Notes

> Hanggang maaari gamitin lang bilang reference at di ipasa bilang sariling gawa.

This project is for educational/reference purposes. Please don't claim as your own.

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
