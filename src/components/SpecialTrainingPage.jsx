import { useState, useEffect } from "react";
import { FaArrowLeft, FaPlay, FaBook, FaTrophy } from "react-icons/fa";
import questionManager from "../utils/questionManager";
import SpecialTrainingQuizPage from "./SpecialTrainingQuizPage";

// 专项训练选择页面
function SpecialTrainingPage({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    // 等待题目数据加载
    await new Promise(resolve => setTimeout(resolve, 500));
    const cats = questionManager.getCategories();
    const stats = questionManager.getStatistics();
    setCategories(cats);
    setStatistics(stats);
    setLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowLevelSelect(true);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const startTraining = () => {
    if (selectedCategory && selectedLevel) {
      setShowQuiz(true);
    }
  };

  const handleQuizBack = () => {
    setShowQuiz(false);
    setSelectedCategory(null);
    setSelectedLevel(null);
    setShowLevelSelect(false);
  };

  // 如果显示答题页面
  if (showQuiz) {
    return (
      <SpecialTrainingQuizPage
        category={selectedCategory}
        level={selectedLevel}
        onBack={handleQuizBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">加载题目数据中...</div>
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
        <h2 className="text-xl font-bold">专项训练</h2>
      </div>

      {/* 统计信息 */}
      <div className="rounded-2xl shadow-md bg-white p-4">
        <div className="text-lg font-semibold text-gray-800 mb-2">📊 题库统计</div>
        <div className="text-sm text-gray-600">
          总题目数: {statistics.totalQuestions || 0} 道
        </div>
      </div>

      {!showLevelSelect ? (
        <>
          {/* 类别选择 */}
          <div className="rounded-2xl shadow-md bg-white p-4">
            <div className="text-lg font-semibold text-gray-800 mb-3">选择训练类别</div>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-3 text-left transition-colors"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="font-medium text-gray-800">{category.topic}</div>
                  <div className="text-sm text-gray-500">{category.stage}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    可选级别: {category.levels.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 级别选择 */}
          <div className="rounded-2xl shadow-md bg-white p-4">
            <div className="text-lg font-semibold text-gray-800 mb-3">
              选择难度级别
            </div>
            <div className="text-sm text-gray-600 mb-3">
              类别: {selectedCategory.topic} ({selectedCategory.stage})
            </div>
            <div className="space-y-2">
              {selectedCategory.levels.map((level, index) => (
                <button
                  key={index}
                  className={`w-full rounded-xl p-3 text-left transition-colors ${
                    selectedLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleLevelSelect(level)}
                >
                  <div className="font-medium">{level}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-3 font-medium"
              onClick={() => {
                setShowLevelSelect(false);
                setSelectedCategory(null);
                setSelectedLevel(null);
              }}
            >
              重新选择
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 font-medium flex items-center justify-center gap-2"
              onClick={startTraining}
              disabled={!selectedLevel}
            >
              <FaPlay />
              开始训练
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SpecialTrainingPage;
