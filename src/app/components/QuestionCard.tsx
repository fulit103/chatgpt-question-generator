import React from 'react';

interface QuestionCardProps {
  question: string;
  answers: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answers }) => {
  return (
    <div className="question-card bg-white rounded-lg shadow-md p-6 mx-auto w-full md:w-1/4">
      <h3 className="text-center text-2xl font-semibold mb-6">{question}</h3>
      <div className="flex flex-col items-center space-y-4">
        {answers.map((answer, index) => (
          <button
            key={index}
            className="w-full md:w-2/3 bg-blue-500 text-white py-2 px-4 rounded text-center"
          >
            {`${index + 1}. ${answer}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;