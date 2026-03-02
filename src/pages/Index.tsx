import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import BattleArena from "@/components/BattleArena";
import PracticeGrounds from "@/components/PracticeGrounds";
import LeaderboardView from "@/components/LeaderboardView";
import MatchHistory from "@/components/MatchHistory";
import KodeShop from "@/components/KodeShop";
import FindingOpponentModal from "@/components/FindingOpponentModal";

type View = "dashboard" | "arena" | "practice" | "leaderboard" | "history" | "shop";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [finding, setFinding] = useState(false);

  const handleEnterArena = () => {
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setCurrentView("arena");
    }, 3000);
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onEnterArena={handleEnterArena} />;
      case "arena":
        return <BattleArena />;
      case "practice":
        return <PracticeGrounds />;
      case "leaderboard":
        return <LeaderboardView />;
      case "history":
        return <MatchHistory />;
      case "shop":
        return <KodeShop />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} setCurrentView={setCurrentView}>
        {renderView()}
      </Layout>
      {finding && <FindingOpponentModal onComplete={() => {}} />}
    </>
  );
};

export default Index;
