import { Routes, Route } from "react-router-dom";

import { UserLanding } from "./components/userLanding/UserLanding";

export default function App() {
  return (
    <Routes>
      <Route path="/landing" element={<UserLanding />} />
    </Routes>
  );
}
