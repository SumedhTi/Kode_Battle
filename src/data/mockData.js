export const mockUser = {
  name: "Arjun Mehta",
  universityId: "CS21B1042",
  university: "IIT Bombay",
  league: "Gold",
  elo: 1847,
  battleCoins: 3250,
  wins: 87,
  losses: 34,
  winStreak: 5,
  rank: 4,
  avatar: "AM",
  branch: "Computer Science",
  year: "3rd Year",
};

export const mockRecentMatches = [
  { opponent: "Priya Sharma", opponentAvatar: "PS", result: "win", eloChange: +18, time: "12 min ago" },
  { opponent: "Rahul Verma", opponentAvatar: "RV", result: "win", eloChange: +15, time: "2 hrs ago" },
  { opponent: "Sneha Iyer", opponentAvatar: "SI", result: "loss", eloChange: -12, time: "5 hrs ago" },
];

export const mockLeaderboard = [
  { rank: 1, name: "Vikram Singh", branch: "CSE", year: "4th", elo: 2134, language: "C++", winRate: 89, avatar: "VS" },
  { rank: 2, name: "Ananya Das", branch: "CSE", year: "3rd", elo: 2067, language: "Python", winRate: 85, avatar: "AD" },
  { rank: 3, name: "Karthik Nair", branch: "IT", year: "4th", elo: 1956, language: "C++", winRate: 82, avatar: "KN" },
  { rank: 4, name: "Arjun Mehta", branch: "CSE", year: "3rd", elo: 1847, language: "C++", winRate: 72, avatar: "AM" },
  { rank: 5, name: "Priya Sharma", branch: "CSE", year: "2nd", elo: 1823, language: "Python", winRate: 70, avatar: "PS" },
  { rank: 6, name: "Rahul Verma", branch: "ECE", year: "3rd", elo: 1798, language: "Java", winRate: 68, avatar: "RV" },
  { rank: 7, name: "Sneha Iyer", branch: "CSE", year: "2nd", elo: 1756, language: "Python", winRate: 67, avatar: "SI" },
  { rank: 8, name: "Aditya Joshi", branch: "IT", year: "3rd", elo: 1734, language: "C++", winRate: 65, avatar: "AJ" },
  { rank: 9, name: "Meera Patel", branch: "CSE", year: "4th", elo: 1712, language: "Java", winRate: 63, avatar: "MP" },
  { rank: 10, name: "Rohan Kumar", branch: "ECE", year: "2nd", elo: 1689, language: "Python", winRate: 61, avatar: "RK" },
  { rank: 11, name: "Kavya Reddy", branch: "CSE", year: "3rd", elo: 1654, language: "C++", winRate: 59, avatar: "KR" },
  { rank: 12, name: "Nikhil Gupta", branch: "IT", year: "4th", elo: 1623, language: "Java", winRate: 57, avatar: "NG" },
];

export const mockProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", status: "solved", acceptance: 78, points: 100 },
  { id: 2, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", status: "unsolved", acceptance: 45, points: 200 },
  { id: 3, title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Graphs", status: "failed", acceptance: 32, points: 400 },
  { id: 4, title: "Maximum Subarray", difficulty: "Easy", topic: "Arrays", status: "solved", acceptance: 82, points: 100 },
  { id: 5, title: "Edit Distance", difficulty: "Hard", topic: "DP", status: "unsolved", acceptance: 28, points: 400 },
  { id: 6, title: "Course Schedule", difficulty: "Medium", topic: "Graphs", status: "unsolved", acceptance: 51, points: 200 },
  { id: 7, title: "Sliding Window Maximum", difficulty: "Hard", topic: "Arrays", status: "failed", acceptance: 35, points: 400 },
  { id: 8, title: "Coin Change", difficulty: "Medium", topic: "DP", status: "solved", acceptance: 55, points: 200 },
  { id: 9, title: "Number of Islands", difficulty: "Medium", topic: "Graphs", status: "unsolved", acceptance: 60, points: 200 },
  { id: 10, title: "Climbing Stairs", difficulty: "Easy", topic: "DP", status: "solved", acceptance: 88, points: 100 },
];

export const mockShopItems = [
  { id: 1, title: "University Hoodie", description: "Premium Kode-Battle branded hoodie", price: 5000, image: "👕", category: "Merch" },
  { id: 2, title: "Cafeteria Voucher", description: "₹500 campus cafeteria credit", price: 500, image: "🍔", category: "Vouchers" },
  { id: 3, title: "Placement Workshop Pass", description: "Exclusive DSA workshop with alumni", price: 2000, image: "🎓", category: "Events" },
  { id: 4, title: "Custom Profile Badge", description: "Animated profile badge for 30 days", price: 300, image: "✨", category: "Digital" },
  { id: 5, title: "1v1 Challenge Token", description: "Challenge any player regardless of league", price: 800, image: "⚔️", category: "Gameplay" },
  { id: 6, title: "Sticker Pack", description: "Holographic Kode-Battle stickers", price: 200, image: "🎨", category: "Merch" },
];

export const mockMatchHistory = [
  {
    id: 1,
    opponent: "Priya Sharma",
    opponentAvatar: "PS",
    result: "win",
    eloChange: +18,
    date: "2024-01-15",
    time: "14:30",
    problem: "Two Sum",
    difficulty: "Easy",
    yourTime: "8:23",
    opponentTime: "12:45",
    testCasesPassed: 15,
    totalTestCases: 15,
    hiddenFailed: [],
    language: "C++",
  },
  {
    id: 2,
    opponent: "Rahul Verma",
    opponentAvatar: "RV",
    result: "win",
    eloChange: +15,
    date: "2024-01-14",
    time: "19:00",
    problem: "Coin Change",
    difficulty: "Medium",
    yourTime: "22:10",
    opponentTime: "25:33",
    testCasesPassed: 20,
    totalTestCases: 20,
    hiddenFailed: [],
    language: "C++",
  },
  {
    id: 3,
    opponent: "Sneha Iyer",
    opponentAvatar: "SI",
    result: "loss",
    eloChange: -12,
    date: "2024-01-13",
    time: "10:15",
    problem: "Edit Distance",
    difficulty: "Hard",
    yourTime: "30:00",
    opponentTime: "24:12",
    testCasesPassed: 12,
    totalTestCases: 18,
    hiddenFailed: [{ id: 14, input: "edge case: empty strings", expected: "0", got: "TLE" }, { id: 16, input: "large input N=10^5", expected: "42", got: "MLE" }],
    language: "C++",
  },
  {
    id: 4,
    opponent: "Vikram Singh",
    opponentAvatar: "VS",
    result: "loss",
    eloChange: -22,
    date: "2024-01-12",
    time: "16:45",
    problem: "Merge K Sorted Lists",
    difficulty: "Hard",
    yourTime: "30:00",
    opponentTime: "18:30",
    testCasesPassed: 8,
    totalTestCases: 15,
    hiddenFailed: [{ id: 10, input: "k=1000 lists", expected: "sorted", got: "TLE" }, { id: 12, input: "empty lists mixed", expected: "[]", got: "Runtime Error" }, { id: 15, input: "single element lists", expected: "sorted", got: "Wrong Answer" }],
    language: "Python",
  },
  {
    id: 5,
    opponent: "Aditya Joshi",
    opponentAvatar: "AJ",
    result: "win",
    eloChange: +11,
    date: "2024-01-11",
    time: "21:00",
    problem: "Maximum Subarray",
    difficulty: "Easy",
    yourTime: "5:45",
    opponentTime: "9:12",
    testCasesPassed: 12,
    totalTestCases: 12,
    hiddenFailed: [],
    language: "C++",
  },
];

export const mockBattleProblem = {
  title: "Longest Increasing Subsequence",
  difficulty: "Medium",
  description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.`,
  constraints: [
    "1 ≤ nums.length ≤ 2500",
    "−10⁴ ≤ nums[i] ≤ 10⁴",
  ],
  sampleInput: "[10, 9, 2, 5, 3, 7, 101, 18]",
  sampleOutput: "4",
  explanation: "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4.",
  testCases: [
    { id: 1, input: "[10,9,2,5,3,7,101,18]", expected: "4", status: "passed" },
    { id: 2, input: "[0,1,0,3,2,3]", expected: "4", status: "passed" },
    { id: 3, input: "[7,7,7,7,7,7,7]", expected: "1", status: "passed" },
    { id: 4, input: "[1,3,6,7,9,4,10,5,6]", expected: "6", status: "failed" },
  ],
};

export const mockCode = `#include <bits/stdc++.h>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return *max_element(dp.begin(), dp.end());
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << lengthOfLIS(nums) << endl;
    return 0;
}`;
