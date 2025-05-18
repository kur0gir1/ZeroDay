import generalQuestions from "./general.json";
import easyQuestions from "./easy.json";
import moderateQuestions from "./moderate.json";
import hardQuestions from "./hard.json";

class QuestionSet {
  constructor(rawQuestions, category = "General") {
    this.category = category;
    this.questions = this._prepareQuestions(rawQuestions);
  }

  _prepareQuestions(questions) {
    const defaultPoints = {
      General: 5,
      Easy: 10,
      Moderate: 20,
      Hard: 30,
    };

    return questions.map((q) => {
      const shuffledOptions = this._shuffleArray(q.options);
      const newAnswerIndex = shuffledOptions.indexOf(q.options[q.answer]);

      return {
        id: q.id,
        category: q.category || this.category, // Use category from JSON or fallback
        question: q.question,
        options: shuffledOptions,
        answer: newAnswerIndex, // Update the answer index to match the shuffled options
        points: q.points || defaultPoints[q.category || this.category], // Use default points based on category
        explanation: q.explanation || null,
      };
    });
  }

  getAllQuestions({ shuffle = false } = {}) {
    return shuffle ? this._shuffleArray([...this.questions]) : [...this.questions];
  }

  getQuestionById(id) {
    return this.questions.find((q) => q.id === id) || null;
  }

  getRandomQuestion() {
    const pool = this.questions;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  _shuffleArray(array) {
    return array
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);
  }
}

// Subclasses for each category
class GeneralQuestions extends QuestionSet {
  constructor() {
    super(generalQuestions, "General");
  }
}

class EasyQuestions extends QuestionSet {
  constructor() {
    super(easyQuestions, "Easy");
  }
}

class ModerateQuestions extends QuestionSet {
  constructor() {
    super(moderateQuestions, "Moderate");
  }
}

class HardQuestions extends QuestionSet {
  constructor() {
    super(hardQuestions, "Hard");
  }
}

export { GeneralQuestions, EasyQuestions, ModerateQuestions, HardQuestions };
