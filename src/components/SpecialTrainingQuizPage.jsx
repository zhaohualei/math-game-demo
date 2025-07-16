import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import questionManager from "../utils/questionManager";
import dataManager from "../utils/dataManager";

// 专项训练答题页面
function SpecialTrainingQuizPage({ category, level, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [category, level]);

  const loadQuestions = async () => {
    setLoading(true);
    // 等待题目数据加载
    await new Promise(resolve => setTimeout(resolve, 300));
    const questionList = questionManager.getRandomQuestions(
      category.stage, 
      category.topic, 
      level, 
      10
    );
    setQuestions(questionList);
    setLoading(false);
  };

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (!showAnswer) {
      // 显示答案
      setShowAnswer(true);
      
      const isCorrect = selected === questions[current].answerIndex;
      if (isCorrect) setScore(s => s + 1);
      
      // 记录用户答案
      const newAnswer = {
        questionId: current,
        question: questions[current].prompt,
        correctAnswer: questions[current].options[questions[current].answerIndex],
        userAnswer: selected !== null ? questions[current].options[selected] : '未选择',
        isCorrect
      };
      
      setUserAnswers(prev => [...prev, newAnswer]);
      
      // 如果答错了，添加到错题本
      if (!isCorrect && selected !== null) {
        dataManager.addWrongQuestion({
          question: questions[current].prompt,
          correctAnswer: questions[current].options[questions[current].answerIndex],
          userAnswer: questions[current].options[selected],
          category: `${category.stage}-${category.topic}`,
          level: level
        });
      }
    } else {
      // 进入下一题
      setSelected(null);
      setShowAnswer(false);
      
      if (current === questions.length - 1) {
        setIsCompleted(true);
        // 添加专项训练记录
        dataManager.addSpecialTrainingRecord({
          category: `${category.stage}-${category.topic}`,
          level: level,
          score: score,
          questionsCorrect: score,
          questionsTotal: questions.length,
          timestamp: new Date().toISOString()
        });
      } else {
        setCurrent(c => c + 1);
      }
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setUserAnswers([]);
    setIsCompleted(false);
    setShowAnswer(false);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">准备题目中...</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans space-y-4">
        <div className="flex items-center gap-2 text-blue-700">
          <button className="text-blue-700" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold">专项训练</h2>
        </div>
        <div className="rounded-2xl shadow-md bg-white p-6 text-center">
          <div className="text-4xl mb-4">😔</div>
          <div className="text-lg font-semibold text-gray-800 mb-2">暂无题目</div>
          <div className="text-gray-600 mb-4">
            该类别暂时没有可用的题目，请选择其他类别
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 font-medium"
            onClick={onBack}
          >
            返回选择
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans space-y-4">
        <div className="flex items-center gap-2 text-blue-700">
          <button className="text-blue-700" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold">训练完成</h2>
        </div>

        <div className="rounded-2xl shadow-md bg-white p-6 space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score === questions.length ? '🎉' : score >= questions.length * 0.8 ? '👍' : score >= questions.length * 0.6 ? '😊' : '💪'}
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {score === questions.length ? '完美通关！' : 
               score >= questions.length * 0.8 ? '表现优秀！' : 
               score >= questions.length * 0.6 ? '继续加油！' : '需要强化！'}
            </div>
            <div className="text-lg text-gray-600">
              本次得分：{score} / {questions.length}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              准确率：{Math.round((score / questions.length) * 100)}%
            </div>
            <div className="text-sm text-gray-500">
              训练类别：{category.topic} ({level})
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">答题详情：</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
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
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 font-medium"
              onClick={handleRestart}
            >
              再练一次
            </button>
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-3 font-medium"
              onClick={onBack}
            >
              返回选择
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const isLast = current === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 max-w-md mx-auto font-sans space-y-4">
      <div className="flex items-center gap-2 text-blue-700">
        <button className="text-blue-700" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-bold">专项训练</h2>
      </div>

      <div className="rounded-2xl shadow-md bg-white p-6 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>题目 {current + 1} / {questions.length}</span>
          <span>得分: {score}</span>
        </div>
        
        <div className="text-sm text-gray-500">
          {category.topic} - {level}
        </div>
        
        <div className="text-lg font-semibold text-gray-800">
          {currentQuestion.prompt}
        </div>
        
        <div className="space-y-2">
          {currentQuestion.options.map((opt, idx) => {
            let buttonClass = "w-full border rounded-lg p-3 text-left transition-colors ";
            
            if (showAnswer) {
              if (idx === currentQuestion.answerIndex) {
                buttonClass += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selected && idx !== currentQuestion.answerIndex) {
                buttonClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
              }
            } else {
              if (selected === idx) {
                buttonClass += "border-blue-500 bg-blue-50";
              } else {
                buttonClass += "border-gray-200 hover:border-gray-300";
              }
            }
            
            return (
              <button
                key={idx}
                className={buttonClass}
                onClick={() => handleSelect(idx)}
                disabled={showAnswer}
              >
                <div className="flex items-center gap-2">
                  {showAnswer && idx === currentQuestion.answerIndex && <FaCheck className="text-green-500" />}
                  {showAnswer && idx === selected && idx !== currentQuestion.answerIndex && <FaTimes className="text-red-500" />}
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
        
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 font-medium disabled:opacity-50"
          disabled={!showAnswer && selected === null}
          onClick={handleNext}
        >
          {!showAnswer ? '确认答案' : (isLast ? '完成训练' : '下一题')}
        </button>
      </div>
    </div>
  );
}

export default SpecialTrainingQuizPage;
