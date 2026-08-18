import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux/store/store.js";
import ErrorBoundary from "./ErrorBoundary.jsx";

//query client
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </Provider>
  </QueryClientProvider>
);
