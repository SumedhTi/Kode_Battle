import { Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import BattleArena from "./components/BattleArena";
import { useState } from "react";
import FindingOpponentModal from "./components/FindingOpponentModal";
import PracticeGrounds from "./components/PracticeGrounds";
import Leaderboard from "./components/LeaderboardView";
import MatchHistory from "./components/MatchHistory";
import KodeShop from "./components/KodeShop";
import { UserProvider } from "./data/userContext";
import { findMatch } from "./services/api";



const App = () => {
  const [finding, setFinding] = useState(false);

  const navigate = useNavigate();

  const handleEnterArena = async () => {
    setFinding(true);

    try {
      const { matchId, isCreator } = await findMatch();
      // Navigate to the arena and keep the matchId in the URL so the arena can join the correct room
      navigate(`/arena?matchId=${matchId}&isCreator=${isCreator}`);
    } catch (error) {
      console.error('Failed to find an opponent:', error);
    } finally {
      setFinding(false);
    }
  };

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout><Dashboard onEnterArena={handleEnterArena} /></Layout>} />
        <Route
          path="/arena"
          element={
            <ProtectedRoute>
              <Layout>
                <BattleArena />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Layout>
                <PracticeGrounds />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Leaderboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <MatchHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Layout>
                <KodeShop />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {finding && <FindingOpponentModal />}
    </UserProvider>
  );
};

export default App;
