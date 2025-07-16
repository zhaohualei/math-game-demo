// 题目管理器
class QuestionManager {
  constructor() {
    this.questionsData = null;
    this.loadQuestions();
  }

  // 加载题目数据
  async loadQuestions() {
    try {
      const response = await fetch('/full_math_quiz_dataset_complete.json');
      this.questionsData = await response.json();
    } catch (error) {
      console.error('加载题目数据失败:', error);
      this.questionsData = [];
    }
  }

  // 获取所有专项类别
  getCategories() {
    if (!this.questionsData) return [];
    
    const categories = [];
    const seen = new Set();
    
    this.questionsData.forEach(item => {
      const key = `${item.stage}-${item.topic}`;
      if (!seen.has(key)) {
        seen.add(key);
        categories.push({
          stage: item.stage,
          topic: item.topic,
          key: key,
          levels: this.getLevelsForTopic(item.stage, item.topic)
        });
      }
    });
    
    return categories;
  }

  // 获取指定主题的所有级别
  getLevelsForTopic(stage, topic) {
    if (!this.questionsData) return [];
    
    return this.questionsData
      .filter(item => item.stage === stage && item.topic === topic)
      .map(item => item.level);
  }

  // 获取指定类别和级别的题目
  getQuestionsByCategory(stage, topic, level) {
    if (!this.questionsData) return [];
    
    const targetItem = this.questionsData.find(
      item => item.stage === stage && item.topic === topic && item.level === level
    );
    
    return targetItem ? targetItem.questions : [];
  }

  // 随机获取指定数量的题目
  getRandomQuestions(stage, topic, level, count = 10) {
    const questions = this.getQuestionsByCategory(stage, topic, level);
    if (questions.length === 0) return [];
    
    // 打乱数组并取前count个
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  // 获取所有阶段
  getStages() {
    if (!this.questionsData) return [];
    
    const stages = [...new Set(this.questionsData.map(item => item.stage))];
    return stages;
  }

  // 获取指定阶段的所有主题
  getTopicsByStage(stage) {
    if (!this.questionsData) return [];
    
    const topics = [...new Set(
      this.questionsData
        .filter(item => item.stage === stage)
        .map(item => item.topic)
    )];
    
    return topics;
  }

  // 获取题目统计信息
  getStatistics() {
    if (!this.questionsData) return {};
    
    const stats = {
      totalQuestions: 0,
      byStage: {},
      byTopic: {}
    };
    
    this.questionsData.forEach(item => {
      const questionCount = item.questions.length;
      stats.totalQuestions += questionCount;
      
      if (!stats.byStage[item.stage]) {
        stats.byStage[item.stage] = 0;
      }
      stats.byStage[item.stage] += questionCount;
      
      if (!stats.byTopic[item.topic]) {
        stats.byTopic[item.topic] = 0;
      }
      stats.byTopic[item.topic] += questionCount;
    });
    
    return stats;
  }
}

export default new QuestionManager();
