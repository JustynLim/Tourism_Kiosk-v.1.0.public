// Minigame/Minigame.jsx
import React, { Component } from 'react';
import './Minigame.css';

class Minigame extends Component {
  static initialQuestions = [
    {
      text: "What is the capital city of Penang?",
      image: "/images/Question_1.jpg",
      options: [
        { id: 0, text: "Kuala Lumpur", isCorrect: false },
        { id: 1, text: "Penang City", isCorrect: false },
        { id: 2, text: "Ipoh", isCorrect: false },
        { id: 3, text: "Georgetown", isCorrect: true },
      ],
    },
    {
      text: "Which iconic street in George Town is famous for its street art and murals?",
      image: "/images/Question_2.jpg",
      options: [
        { id: 0, text: "Armenian Street", isCorrect: true },
        { id: 1, text: "Chulia Street", isCorrect: false },
        { id: 2, text: "Penang Road", isCorrect: false },
        { id: 3, text: "Macalister Road", isCorrect: false },
      ],
    },
    {
      text: "Which temple in Penang is known as the 'Temple of Supreme Bliss'?",
      image: "/images/Question_3.jpg",
      options: [
        { id: 0, text: "Kek Lok Si Temple", isCorrect: true },
        { id: 1, text: "Sri Mahamariamman Temple", isCorrect: false },
        { id: 2, text: "Kapitan Keling Mosque", isCorrect: false },
        { id: 3, text: "Dhammikarama Burmese Temple", isCorrect: false },
      ],
    },
    {
      text: "The Penang Botanic Gardens are more commonly known as what?",
      image: "/images/Question_4.jpg",
      options: [
        { id: 0, text: "Teluk Kumbar", isCorrect: false },
        { id: 1, text: "Waterfall Gardens", isCorrect: true },
        { id: 2, text: "Tanjung Bungah", isCorrect: false },
        { id: 3, text: "Teluk Bahang", isCorrect: false },
      ],
    },
    {
      text: "Which of the following is NOT a colour of the flag of Penang?",
      image: "/images/Question_5.jpg",
      options: [
        { id: 0, text: "White", isCorrect: false },
        { id: 1, text: "Yellow", isCorrect: true },
        { id: 2, text: "Royal Blue", isCorrect: true },
        { id: 3, text: "Light Blue", isCorrect: false },
      ],
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      showResults: false,
      currentQuestion: 0,
      score: 0,
      questions: this.shuffleQuestions([...Minigame.initialQuestions]),
    };
  }

  shuffleQuestions = (questions) => {
    return questions.sort(() => Math.random() - 0.5);
  };

  shuffleAnswers = (options) => {
    return [...options].sort(() => Math.random() - 0.5);
  };

  optionClicked = (isCorrect) => {
    const { currentQuestion, questions, score } = this.state;

    if (isCorrect) {
      this.setState({ score: score + 1 });
    }

    if (currentQuestion + 1 < questions.length) {
      this.setState({ currentQuestion: currentQuestion + 1 });
    } else {
      this.setState({ showResults: true });
    }
  };

  restartGame = () => {
    this.setState({
      score: 0,
      currentQuestion: 0,
      showResults: false,
      questions: this.shuffleQuestions([...Minigame.initialQuestions]),
    });
  };

  render() {
    const { showResults, currentQuestion, score, questions } = this.state;

    return (
      <div className="minigame-container">

        {/* 2. Current Score  */}
        <h2>Score: {score}</h2>

        {/* 3. Show results or show the question game  */}
        {showResults ? (
          /* 4. Final Results */
          <div className="final-results">
            <h1>Final Results</h1>
            <h2>
              {score} out of {questions.length} correct - (
              {(score / questions.length) * 100}%)
            </h2>
            <button onClick={() => this.restartGame()}>Restart game</button>
          </div>
        ) : (
          /* 5. Question Card  */
          <div className="question-card">
            {/* Current Question  */}
            <h2>
              Question: {currentQuestion + 1} out of {questions.length}
            </h2>
            <h3 className="question-text">{questions[currentQuestion].text}</h3>

            {/* Log the image path */}
            {console.log("Image Path:", questions[currentQuestion].image)}

            {/* Display the image with a fixed size */}
            <img
              src={questions[currentQuestion].image}
              alt={`Question ${currentQuestion + 1}`}
              style={{ width: '300px', height: 'auto' }} // Set the desired width and height
            />

            {/* List of shuffled possible answers  */}
            <ul>
              {this.shuffleAnswers(questions[currentQuestion].options).map((option) => {
                return (
                  <li
                    key={option.id}
                    onClick={() => this.optionClicked(option.isCorrect)}
                  >
                    {option.text}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Minigame;