import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import BattleArena from "./components/BattleArena";
import { useState } from "react";
import FindingOpponentModal from "./components/FindingOpponentModal";
import PracticeGrounds from "./components/PracticeGrounds";
import Leaderboard from "./components/LeaderboardView";
import MatchHistory from "./components/MatchHistory";
import KodeShop from "./components/KodeShop";



const App = () => {
  const [finding, setFinding] = useState(false);

  const handleEnterArena = () => {
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      //redirect
    }, 3000);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Dashboard onEnterArena={handleEnterArena}/></Layout>} />
        <Route path="/arena" element={<Layout><BattleArena /></Layout>} />
        <Route path="/practice" element={<Layout><PracticeGrounds /></Layout>} />
        <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
        <Route path="/history" element={<Layout><MatchHistory /></Layout>} />
        <Route path="/shop" element={<Layout><KodeShop /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {finding && <FindingOpponentModal onComplete={() => {}} />}
    </>
  );
};

export default App;
