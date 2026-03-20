// ==============================================
// MAIN.JSX - THE ENTRY POINT OF OUR APP
// ==============================================
// This is the FIRST JavaScript file that runs when our app starts
// It connects our React app to the HTML page

// Import React - the library that helps us build user interfaces
import React from 'react'

// Import ReactDOM - helps React work with the browser's DOM (Document Object Model)
// The DOM is the structure of our HTML page
import ReactDOM from 'react-dom/client'

// Import BrowserRouter - this enables navigation/routing in our app
// It lets us have different "pages" in our single-page app
import { BrowserRouter } from 'react-router-dom'

// Import our main App component - this contains our entire application
import App from './App.jsx'

// Import our CSS styles - this makes our app look good!
import './index.css'

// ==============================================
// RENDER THE APP
// ==============================================
// This code finds the 'root' div in index.html and puts our React app inside it

ReactDOM.createRoot(document.getElementById('root')).render(
    // StrictMode helps us find potential problems in our code during development
    // It doesn't affect the production build
    <React.StrictMode>
        {/* BrowserRouter wraps our app to enable page navigation */}
        <BrowserRouter>
            {/* App is our main component that contains everything */}
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
