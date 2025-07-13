import { useState, useEffect } from 'react';
import { FaArrowLeft, FaBookOpen, FaCheck, FaEye, FaEyeSlash, FaTimes, FaRedo } from 'react-icons/fa';
import dataManager from '../utils/dataManager';

export default function WrongQuestionsPage({ onBack }) {
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unreviewed, reviewed
  const [showAnswers, setShowAnswers] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    loadWrongQuestions();
  }, []);

  const loadWrongQuestions = () => {
    const questions = dataManager.getWrongQuestions();
    setWrongQuestions(questions);
  };

  const filteredQuestions = wrongQuestions.filter(q => {
    if (filter === 'unreviewed') return !q.reviewed;
    if (filter === 'reviewed') return q.reviewed;
    return true;
  });

  const toggleAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const markAsReviewed = (questionId) => {
    dataManager.markQuestionAsReviewed(questionId);
    loadWrongQuestions();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getFilterCount = (filterType) => {
    if (filterType === 'unreviewed') return wrongQuestions.filter(q => !q.reviewed).length;
    if (filterType === 'reviewed') return wrongQuestions.filter(q => q.reviewed).length;
    return wrongQuestions.length;
  };

  const startPractice = () => {
    const unreviewedQuestions = wrongQuestions.filter(q => !q.reviewed);
    if (unreviewedQuestions.length === 0) {
      alert('暂无未复习的题目');
      return;
    }
    
    // 这里可以启动练习模式
    alert(`开始练习 ${unreviewedQuestions.length} 道未复习题目`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 text-green-700 mb-4">
        <button onClick={onBack} className="text-green-700">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">📘 错题本</h2>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-2xl shadow-md bg-gradient-to-r from-red-100 to-orange-100 p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{wrongQuestions.length}</div>
            <div className="text-xs text-gray-600">总错题</div>
          </div>
        </div>
        
        <div className="rounded-2xl shadow-md bg-gradient-to-r from-yellow-100 to-orange-100 p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {getFilterCount('unreviewed')}
            </div>
            <div className="text-xs text-gray-600">待复习</div>
          </div>
        </div>
        
        <div className="rounded-2xl shadow-md bg-gradient-to-r from-green-100 to-blue-100 p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {getFilterCount('reviewed')}
            </div>
            <div className="text-xs text-gray-600">已复习</div>
          </div>
        </div>
      </div>

      {/* 练习按钮 */}
      <div className="rounded-2xl shadow-md bg-gradient-to-r from-blue-500 to-purple-500 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">错题专项练习</div>
            <div className="text-blue-100 text-sm">
              {getFilterCount('unreviewed')} 道题目等待复习
            </div>
          </div>
          <button 
            onClick={startPractice}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <FaRedo />
            开始练习
          </button>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="flex bg-white rounded-2xl shadow-md p-1 mb-4">
        {[
          { key: 'all', label: '全部', count: getFilterCount('all') },
          { key: 'unreviewed', label: '未复习', count: getFilterCount('unreviewed') },
          { key: 'reviewed', label: '已复习', count: getFilterCount('reviewed') }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 错题列表 */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">🎉</div>
            <div className="text-gray-500">
              {filter === 'all' ? '还没有错题，继续加油！' : 
               filter === 'unreviewed' ? '没有未复习的题目' : '没有已复习的题目'}
            </div>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className={`rounded-2xl shadow-md p-4 ${
                question.reviewed ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-lg font-medium text-gray-800 mb-1">
                    {question.question}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(question.date)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {question.reviewed && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      已复习
                    </div>
                  )}
                  <button
                    onClick={() => toggleAnswer(question.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showAnswers[question.id] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {showAnswers[question.id] && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <FaTimes className="text-red-500" />
                    <span className="text-sm text-gray-600">我的答案:</span>
                    <span className="text-sm font-medium text-red-600">
                      {question.userAnswer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span className="text-sm text-gray-600">正确答案:</span>
                    <span className="text-sm font-medium text-green-600">
                      {question.correctAnswer}
                    </span>
                  </div>
                  {!question.reviewed && (
                    <div className="pt-2">
                      <button
                        onClick={() => markAsReviewed(question.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-xl font-medium"
                      >
                        标记为已复习
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 底部提示 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        定期复习错题，提高答题准确率
      </div>
    </div>
  );
} 