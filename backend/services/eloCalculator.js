// ELO Rating Calculator
const K = 32; // K-factor

const calculateNewRatings = (player1Rating, player2Rating, player1Won) => {
  const expectedScore1 = 1 / (1 + Math.pow(10, (player2Rating - player1Rating) / 400));
  const expectedScore2 = 1 - expectedScore1;

  const actualScore1 = player1Won ? 1 : 0;
  const actualScore2 = 1 - actualScore1;

  const newRating1 = Math.round(player1Rating + K * (actualScore1 - expectedScore1));
  const newRating2 = Math.round(player2Rating + K * (actualScore2 - expectedScore2));

  return {
    newRating1,
    newRating2,
    change1: newRating1 - player1Rating,
    change2: newRating2 - player2Rating,
  };
};

export { calculateNewRatings };