// 数据管理系统 - 管理用户积分、打卡记录、错题记录等
class DataManager {
  constructor() {
    this.initData();
  }

  // 初始化数据
  initData() {
    const defaultData = {
      userProfile: {
        totalScore: 430,
        level: '数学小将',
        streak: 5,
        rank: 38
      },
      checkinRecords: this.generateDefaultCheckinRecords(),
      wrongQuestions: this.generateDefaultWrongQuestions(),
      rankings: this.generateDefaultRankings()
    };

    // 如果localStorage中没有数据，使用默认数据
    Object.keys(defaultData).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultData[key]));
      }
    });
  }

  // 生成默认的打卡记录（最近30天）
  generateDefaultCheckinRecords() {
    const records = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      const isCheckedIn = Math.random() > 0.3; // 70%的概率已打卡
      
      records.push({
        date: dateStr,
        isCheckedIn,
        score: isCheckedIn ? Math.floor(Math.random() * 5) + 3 : 0, // 3-7分
        questionsCorrect: isCheckedIn ? Math.floor(Math.random() * 8) + 2 : 0, // 2-9题
        questionsTotal: isCheckedIn ? 10 : 0
      });
    }
    
    return records;
  }

  // 生成默认的错题记录
  generateDefaultWrongQuestions() {
    const questions = [
      { id: 1, question: "2^3 = ?", correctAnswer: "8", userAnswer: "6", date: "2024-01-20", reviewed: false },
      { id: 2, question: "√16 = ?", correctAnswer: "4", userAnswer: "8", date: "2024-01-20", reviewed: false },
      { id: 3, question: "5! = ?", correctAnswer: "120", userAnswer: "100", date: "2024-01-19", reviewed: true },
      { id: 4, question: "3^2 + 2^3 = ?", correctAnswer: "17", userAnswer: "15", date: "2024-01-19", reviewed: false },
      { id: 5, question: "log₂(8) = ?", correctAnswer: "3", userAnswer: "2", date: "2024-01-18", reviewed: false },
      { id: 6, question: "sin(90°) = ?", correctAnswer: "1", userAnswer: "0", date: "2024-01-18", reviewed: false },
      { id: 7, question: "15 ÷ 3 × 2 = ?", correctAnswer: "10", userAnswer: "2.5", date: "2024-01-17", reviewed: true },
      { id: 8, question: "2x + 3 = 11, x = ?", correctAnswer: "4", userAnswer: "5", date: "2024-01-17", reviewed: false }
    ];
    
    return questions;
  }

  // 生成默认的排行榜数据
  generateDefaultRankings() {
    const names = ['小明', '小红', '小刚', '小丽', '小强', '小华', '小美', '小军', '小艳', '小伟'];
    const rankings = [];
    
    for (let i = 0; i < 50; i++) {
      rankings.push({
        rank: i + 1,
        name: names[i % names.length] + (i > 9 ? Math.floor(i / 10) : ''),
        score: Math.floor(Math.random() * 1000) + 500 - i * 10,
        level: this.getLevelByScore(Math.floor(Math.random() * 1000) + 500 - i * 10),
        streak: Math.floor(Math.random() * 20) + 1
      });
    }
    
    return rankings.sort((a, b) => b.score - a.score);
  }

  // 根据积分获取等级
  getLevelByScore(score) {
    if (score >= 1000) return '数学大师';
    if (score >= 800) return '数学专家';
    if (score >= 600) return '数学高手';
    if (score >= 400) return '数学小将';
    if (score >= 200) return '数学新手';
    return '数学萌新';
  }

  // 获取用户资料
  getUserProfile() {
    return JSON.parse(localStorage.getItem('userProfile') || '{}');
  }

  // 更新用户资料
  updateUserProfile(profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  // 获取打卡记录
  getCheckinRecords() {
    return JSON.parse(localStorage.getItem('checkinRecords') || '[]');
  }

  // 添加打卡记录
  addCheckinRecord(record) {
    const records = this.getCheckinRecords();
    const today = new Date().toISOString().split('T')[0];
    
    // 检查今天是否已打卡
    const todayRecord = records.find(r => r.date === today);
    if (todayRecord) {
      todayRecord.score += record.score;
      todayRecord.questionsCorrect += record.questionsCorrect;
      todayRecord.questionsTotal += record.questionsTotal;
    } else {
      records.push({
        date: today,
        isCheckedIn: true,
        ...record
      });
    }
    
    localStorage.setItem('checkinRecords', JSON.stringify(records));
    
    // 更新用户积分
    const profile = this.getUserProfile();
    profile.totalScore += record.score;
    profile.level = this.getLevelByScore(profile.totalScore);
    this.updateUserProfile(profile);
  }

  // 获取错题记录
  getWrongQuestions() {
    return JSON.parse(localStorage.getItem('wrongQuestions') || '[]');
  }

  // 添加错题记录
  addWrongQuestion(question) {
    const questions = this.getWrongQuestions();
    const newQuestion = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      reviewed: false,
      ...question
    };
    
    questions.unshift(newQuestion);
    localStorage.setItem('wrongQuestions', JSON.stringify(questions));
  }

  // 标记错题为已复习
  markQuestionAsReviewed(questionId) {
    const questions = this.getWrongQuestions();
    const question = questions.find(q => q.id === questionId);
    if (question) {
      question.reviewed = true;
      localStorage.setItem('wrongQuestions', JSON.stringify(questions));
    }
  }

  // 获取排行榜
  getRankings() {
    return JSON.parse(localStorage.getItem('rankings') || '[]');
  }

  // 更新排行榜
  updateRankings(rankings) {
    localStorage.setItem('rankings', JSON.stringify(rankings));
  }

  // 获取连续打卡天数
  getStreak() {
    const records = this.getCheckinRecords();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < records.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const record = records.find(r => r.date === dateStr);
      if (record && record.isCheckedIn) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // 获取未复习的错题数量
  getUnreviewedQuestionsCount() {
    const questions = this.getWrongQuestions();
    return questions.filter(q => !q.reviewed).length;
  }

  // 获取今日是否已打卡
  isTodayCheckedIn() {
    const records = this.getCheckinRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(r => r.date === today);
    return todayRecord ? todayRecord.isCheckedIn : false;
  }
}

export default new DataManager(); 