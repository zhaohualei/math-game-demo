import { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrophy, FaMedal, FaUser, FaFire } from 'react-icons/fa';
import dataManager from '../utils/dataManager';

export default function RankingPage({ onBack }) {
  const [rankings, setRankings] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [selectedTab, setSelectedTab] = useState('all'); // all, friends, nearby

  useEffect(() => {
    setRankings(dataManager.getRankings());
    setUserProfile(dataManager.getUserProfile());
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-yellow-600" />;
    return <span className="text-gray-600 font-bold">{rank}</span>;
  };

  const getLevelColor = (level) => {
    const colors = {
      '数学大师': 'text-purple-600',
      '数学专家': 'text-blue-600',
      '数学高手': 'text-green-600',
      '数学小将': 'text-orange-600',
      '数学新手': 'text-gray-600',
      '数学萌新': 'text-pink-600'
    };
    return colors[level] || 'text-gray-600';
  };

  const getCurrentUserRank = () => {
    const userRank = rankings.find(r => r.score <= userProfile.totalScore);
    return userRank ? userRank.rank : rankings.length + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 text-purple-700 mb-4">
        <button onClick={onBack} className="text-purple-700">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">🏆 积分排行榜</h2>
      </div>

      {/* 我的排名卡片 */}
      <div className="rounded-2xl shadow-md bg-gradient-to-r from-purple-100 to-pink-100 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-800">我的排名</div>
              <div className="text-sm text-gray-600">
                第 {getCurrentUserRank()} 名
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">
              {userProfile.totalScore} 分
            </div>
            <div className={`text-sm ${getLevelColor(userProfile.level)}`}>
              {userProfile.level}
            </div>
          </div>
        </div>
      </div>

      {/* 排名标签 */}
      <div className="flex bg-white rounded-2xl shadow-md p-1 mb-4">
        {[
          { key: 'all', label: '全部排名' },
          { key: 'friends', label: '好友排名' },
          { key: 'nearby', label: '本地排名' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              selectedTab === tab.key
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 排行榜列表 */}
      <div className="space-y-2">
        {rankings.slice(0, 50).map((user, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-4 flex items-center justify-between ${
              user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{user.name}</div>
                <div className={`text-sm ${getLevelColor(user.level)}`}>
                  {user.level}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-purple-600">{user.score} 分</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FaFire className="text-orange-500" />
                {user.streak} 天
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        每日答题可获得积分，积分越高排名越靠前
      </div>
    </div>
  );
} 