
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaTrophy, FaBookOpen, FaStore, FaArrowLeft, FaDumbbell } from "react-icons/fa";
import dataManager from "./utils/dataManager";
import RankingPage from "./components/RankingPage";
import CheckinLogPage from "./components/CheckinLogPage";
import WrongQuestionsPage from "./components/WrongQuestionsPage";
import SpecialTrainingPage from "./components/SpecialTrainingPage";

export const demoQuestions = [
  { id: 1, prompt: "2^3 = ?", options: ["6", "8", "9", "12"], answerIndex: 1 },
  { id: 2, prompt: "3^2 = ?", options: ["6", "7", "9", "12"], answerIndex: 2 },
  { id: 3, prompt: "5^2 = ?", options: ["10", "20", "25", "30"], answerIndex: 2 },
  { id: 4, prompt: "4^3 = ?", options: ["16", "32", "64", "12"], answerIndex: 2 },
  { id: 5, prompt: "10^1 = ?", options: ["1", "10", "100", "0"], answerIndex: 1 },
];

function QuestionPage({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const q = demoQuestions[current];
  const isLast = current === demoQuestions.length - 1;

  function handleSelect(idx) {
    setSelected(idx);
  }

  function handleNext() {
    const isCorrect = selected === q.answerIndex;
    if (isCorrect) setScore((s) => s + 1);
    
    // 记录用户答案
    const newAnswer = {
      questionId: q.id,
      question: q.prompt,
      correctAnswer: q.options[q.answerIndex],
      userAnswer: q.options[selected],
      isCorrect
    };
    
    setUserAnswers(prev => [...prev, newAnswer]);
    
    // 如果答错了，添加到错题本
    if (!isCorrect) {
      dataManager.addWrongQuestion({
        question: q.prompt,
        correctAnswer: q.options[q.answerIndex],
        userAnswer: q.options[selected]
      });
    }
    
    setSelected(null);
    
    if (isLast) {
      setIsCompleted(true);
      // 添加打卡记录
      dataManager.addCheckinRecord({
        score: score + (isCorrect ? 1 : 0),
        questionsCorrect: score + (isCorrect ? 1 : 0),
        questionsTotal: demoQuestions.length
      });
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setUserAnswers([]);
    setIsCompleted(false);
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans space-y-4">
        <div className="flex items-center gap-2 text-blue-700">
          <button className="text-blue-700" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold">挑战完成</h2>
        </div>

        <div className="rounded-2xl shadow-md bg-white p-6 space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score === demoQuestions.length ? '🎉' : score >= 3 ? '👍' : '💪'}
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {score === demoQuestions.length ? '完美！' : score >= 3 ? '不错！' : '继续努力！'}
            </div>
            <div className="text-lg text-gray-600">
              本次得分：{score} / {demoQuestions.length}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              已获得 {score} 积分，已同步到您的账户
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">答题详情：</h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className={`p-3 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="text-sm font-medium text-gray-700">{answer.question}</div>
                <div className="text-xs text-gray-500 mt-1">
                  我的答案: <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answer.userAnswer}
                  </span>
                  {!answer.isCorrect && (
                    <span className="text-green-600 ml-2">
                      正确答案: {answer.correctAnswer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2 font-medium"
              onClick={handleRestart}
            >
              再来一次
            </button>
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-2 font-medium"
              onClick={onBack}
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans space-y-4">
      <div className="flex items-center gap-2 text-blue-700">
        <button className="text-blue-700" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">今日挑战</h2>
      </div>

      <div className="rounded-2xl shadow-md bg-white p-6 space-y-4">
        <div className="text-sm text-gray-500">
          题目 {current + 1} / {demoQuestions.length}
        </div>
        <div className="text-lg font-semibold text-gray-800">{q.prompt}</div>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`w-full border rounded p-2 text-left transition-colors ${
                selected === idx ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelect(idx)}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2 disabled:opacity-50"
          disabled={selected === null}
          onClick={handleNext}
        >
          {isLast ? "提交" : "下一题"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userProfile, setUserProfile] = useState({});
  const [unreviewedCount, setUnreviewedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTodayCheckedIn, setIsTodayCheckedIn] = useState(false);

  useEffect(() => {
    // 加载用户数据
    const profile = dataManager.getUserProfile();
    setUserProfile(profile);
    setUnreviewedCount(dataManager.getUnreviewedQuestionsCount());
    setStreak(dataManager.getStreak());
    setIsTodayCheckedIn(dataManager.isTodayCheckedIn());
  }, [currentPage]);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'quiz') {
    return <QuestionPage onBack={navigateToHome} />;
  }

  if (currentPage === 'ranking') {
    return <RankingPage onBack={navigateToHome} />;
  }

  if (currentPage === 'checkin') {
    return <CheckinLogPage onBack={navigateToHome} />;
  }

  if (currentPage === 'wrong-questions') {
    return <WrongQuestionsPage onBack={navigateToHome} />;
  }

  if (currentPage === 'special-training') {
    return <SpecialTrainingPage onBack={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 space-y-4 max-w-md mx-auto font-sans">
      <div className="text-3xl font-extrabold text-center text-blue-700 drop-shadow-sm">
        数学闯关王
      </div>

      <div className="rounded-2xl shadow-md bg-white p-5 space-y-2">
        <div className="text-lg font-semibold text-gray-800">🎯 今日挑战</div>
        <div className="text-sm text-gray-600">
          10题挑战：{isTodayCheckedIn ? '已完成' : '未完成'}
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl p-2"
          onClick={() => navigateToPage('quiz')}
        >
          {isTodayCheckedIn ? '再次挑战' : '开始挑战'}
        </button>
      </div>

      <div className="rounded-2xl shadow-md p-5 flex justify-between items-center bg-yellow-50">
        <div>
          <div className="text-xs text-gray-500">我的积分</div>
          <div className="text-lg font-bold text-yellow-600">🏅 {userProfile.totalScore || 430} 分</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">当前称号</div>
          <div className="text-lg font-bold text-yellow-600">🌟 {userProfile.level || '数学小将'}</div>
        </div>
      </div>

      <div 
        className="rounded-2xl shadow-md bg-pink-50 p-4 flex items-center gap-4 cursor-pointer hover:bg-pink-100 transition-colors"
        onClick={() => navigateToPage('checkin')}
      >
        <FaCalendarAlt className="text-pink-500" />
        <div>
          <div className="text-sm font-semibold text-gray-700">📅 打卡日历</div>
          <div className="text-xs text-gray-500">
            {streak > 0 ? `连续${streak}天` : '今日未打卡'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div 
          className="rounded-2xl shadow-md bg-green-50 p-4 flex items-center gap-2 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => navigateToPage('wrong-questions')}
        >
          <FaBookOpen className="text-green-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">📘 错题本</div>
            <div className="text-xs text-gray-500">{unreviewedCount} 道待复习</div>
          </div>
        </div>

        <div 
          className="rounded-2xl shadow-md bg-indigo-50 p-4 flex items-center gap-2 cursor-pointer hover:bg-indigo-100 transition-colors"
          onClick={() => navigateToPage('special-training')}
        >
          <FaDumbbell className="text-indigo-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">🏋️ 专项训练</div>
            <div className="text-xs text-gray-500">分类练习强化</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl shadow-md bg-orange-50 p-4 flex items-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors">
          <FaStore className="text-orange-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">🎁 积分商城</div>
            <div className="text-xs text-gray-500">皮肤 / 角色 / 背景</div>
          </div>
        </div>

        <div 
          className="rounded-2xl shadow-md bg-purple-50 p-4 flex items-center gap-2 cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => navigateToPage('ranking')}
        >
          <FaTrophy className="text-purple-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">🏆 排行榜</div>
            <div className="text-xs text-gray-500">当前排名：第 {userProfile.rank || 38} 名</div>
          </div>
        </div>
      </div>
    </div>
  );
}
