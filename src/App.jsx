
import { useState } from "react";
import { FaCalendarAlt, FaTrophy, FaBookOpen, FaStore, FaArrowLeft } from "react-icons/fa";

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

  const q = demoQuestions[current];
  const isLast = current === demoQuestions.length - 1;

  function handleSelect(idx) {
    setSelected(idx);
  }

  function handleNext() {
    if (selected === q.answerIndex) setScore((s) => s + 1);
    setSelected(null);
    if (!isLast) {
      setCurrent((c) => c + 1);
    }
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
              className={`w-full border rounded p-2 text-left ${
                selected === idx ? "border-blue-500" : ""
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
        {isLast && selected !== null && (
          <div className="text-center text-green-600 font-bold mt-2">
            本次得分：{score} / {demoQuestions.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [inQuiz, setInQuiz] = useState(false);

  if (inQuiz) return <QuestionPage onBack={() => setInQuiz(false)} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 space-y-4 max-w-md mx-auto font-sans">
      <div className="text-3xl font-extrabold text-center text-blue-700 drop-shadow-sm">
        数学闯关王
      </div>

      <div className="rounded-2xl shadow-md bg-white p-5 space-y-2">
        <div className="text-lg font-semibold text-gray-800">🎯 今日挑战</div>
        <div className="text-sm text-gray-600">10题挑战：已完成 0 / 10</div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl p-2"
          onClick={() => setInQuiz(true)}
        >
          开始挑战
        </button>
      </div>

      <div className="rounded-2xl shadow-md p-5 flex justify-between items-center bg-yellow-50">
        <div>
          <div className="text-xs text-gray-500">我的积分</div>
          <div className="text-lg font-bold text-yellow-600">🏅 430 分</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">当前称号</div>
          <div className="text-lg font-bold text-yellow-600">🌟 数学小将</div>
        </div>
      </div>

      <div className="rounded-2xl shadow-md bg-pink-50 p-4 flex items-center gap-4">
        <FaCalendarAlt className="text-pink-500" />
        <div>
          <div className="text-sm font-semibold text-gray-700">📅 打卡日历</div>
          <div className="text-xs text-gray-500">✅✅✅□✅✅（连续5天）</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl shadow-md bg-green-50 p-4 flex items-center gap-2">
          <FaBookOpen className="text-green-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">📘 错题本</div>
            <div className="text-xs text-gray-500">8 道待复习</div>
          </div>
        </div>

        <div className="rounded-2xl shadow-md bg-orange-50 p-4 flex items-center gap-2">
          <FaStore className="text-orange-500" />
          <div>
            <div className="text-sm font-semibold text-gray-700">🎁 积分商城</div>
            <div className="text-xs text-gray-500">皮肤 / 角色 / 背景</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-md bg-purple-50 p-4 flex items-center gap-4">
        <FaTrophy className="text-purple-500" />
        <div>
          <div className="text-sm font-semibold text-gray-700">🏆 排行榜</div>
          <div className="text-xs text-gray-500">当前排名：第 38 名</div>
        </div>
      </div>
    </div>
  );
}
