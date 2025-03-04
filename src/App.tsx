import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Rootlayout from "./pages/Rootlayout";
import Home from "./pages/home/Home";
import Sync from "./pages/sync/Sync";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rootlayout />}>
          <Route index element={<Home />} />
          <Route path="sync" element={<Sync />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
