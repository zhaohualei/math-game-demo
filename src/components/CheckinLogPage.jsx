import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaTimes, FaFire, FaChartBar } from 'react-icons/fa';
import dataManager from '../utils/dataManager';

export default function CheckinLogPage({ onBack }) {
  const [checkinRecords, setCheckinRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalDays: 0,
    checkedDays: 0,
    currentStreak: 0,
    totalScore: 0
  });

  useEffect(() => {
    const records = dataManager.getCheckinRecords();
    setCheckinRecords(records);
    
    // 计算统计数据
    const checkedDays = records.filter(r => r.isCheckedIn).length;
    const totalScore = records.reduce((sum, r) => sum + r.score, 0);
    const currentStreak = dataManager.getStreak();
    
    setStats({
      totalDays: records.length,
      checkedDays,
      currentStreak,
      totalScore
    });
  }, []);

  const getCalendarDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];
    
    // 空白天数
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // 实际天数
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const record = checkinRecords.find(r => r.date === dateStr);
      
      days.push({
        day,
        date: dateStr,
        record: record || { isCheckedIn: false, score: 0, questionsCorrect: 0, questionsTotal: 0 }
      });
    }
    
    return days;
  };

  const getMonthName = (month) => {
    const names = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return names[month];
  };

  const getDayClass = (record) => {
    if (!record.isCheckedIn) return 'bg-gray-100 text-gray-400';
    if (record.score >= 8) return 'bg-green-500 text-white';
    if (record.score >= 5) return 'bg-yellow-500 text-white';
    return 'bg-orange-500 text-white';
  };

  const getRecentRecords = () => {
    return checkinRecords
      .filter(r => r.isCheckedIn)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 text-pink-700 mb-4">
        <button onClick={onBack} className="text-pink-700">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">📅 打卡日志</h2>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl shadow-md bg-gradient-to-r from-green-100 to-blue-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaFire className="text-orange-500" />
            <span className="text-sm font-medium text-gray-700">连续打卡</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
          <div className="text-xs text-gray-500">天</div>
        </div>
        
        <div className="rounded-2xl shadow-md bg-gradient-to-r from-purple-100 to-pink-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaChartBar className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700">打卡率</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalDays > 0 ? Math.round((stats.checkedDays / stats.totalDays) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-500">{stats.checkedDays}/{stats.totalDays}</div>
        </div>
      </div>

      {/* 日历视图 */}
      <div className="rounded-2xl shadow-md bg-white p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => changeMonth('prev')}
            className="text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedYear}年{getMonthName(selectedMonth)}
          </h3>
          <button 
            onClick={() => changeMonth('next')}
            className="text-gray-600 hover:text-gray-800"
          >
            →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getCalendarDays().map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                day ? getDayClass(day.record) : ''
              }`}
            >
              {day ? day.day : ''}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span className="text-gray-500">未打卡</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-500">低分</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-500">中分</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-500">高分</span>
          </div>
        </div>
      </div>

      {/* 最近打卡记录 */}
      <div className="rounded-2xl shadow-md bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">最近打卡记录</h3>
        <div className="space-y-3">
          {getRecentRecords().map((record, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  record.isCheckedIn ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {record.isCheckedIn ? 
                    <FaCheck className="text-white text-sm" /> : 
                    <FaTimes className="text-white text-sm" />
                  }
                </div>
                <div>
                  <div className="font-medium text-gray-800">{formatDate(record.date)}</div>
                  <div className="text-sm text-gray-500">
                    {record.questionsCorrect}/{record.questionsTotal} 题正确
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">+{record.score}</div>
                <div className="text-xs text-gray-500">积分</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        每日完成挑战即可打卡，连续打卡获得更多奖励
      </div>
    </div>
  );
} 