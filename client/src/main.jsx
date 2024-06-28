import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";


//FONTAWESOME thing
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
// Add the fab icons to the library
library.add(fab);
//FONTAWESOME THING END

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
   
  </React.StrictMode>
);
