import "./App.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from "./component/Home";
import Dashboard from "./Dashboard.jsx/Dasboard";
// Define Layout Component
function Layout() {
  return (
    <div className="">
      <Header />
      <main>
        <Outlet /> {/* This renders child routes */}
      </main>
      <Footer />
    </div>
  );
}

// Define Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  )
);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
