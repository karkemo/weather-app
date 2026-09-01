# 🌤️ Weather App

A modern, clean, and responsive weather application built with React and Vite, providing real-time weather data and forecasts across devices.

---

## 🚀 Features

* **Global Search:** Find current weather conditions for any city worldwide instantly.
* **Detailed Metrics:** View real-time temperature, feels-like temperature and humidity.
* **Geolocation Support:** Automatically fetch weather details for your current location.
* **Multi-Day Forecast:** Detailed weather predictions to help you plan ahead.
* **Responsive Layout:** Tailored design for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Language:** JavaScript (ES6+)

---

## 📁 Project Structure

```text
weather-app/
├── design/
│   ├── phone.jpg
│   ├── web.jpg
│   └── web_main.jpg
├── public/
│   ├── icons/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.png
├── scripts/
│   └── download-img.js
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karkemo/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory of the project and add your Weather API key:
   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 License

This project is licensed under the [GPL-3.0](LICENSE) License.