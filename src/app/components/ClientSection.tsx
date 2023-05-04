"use client";

import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

interface QuizData {
  quiz_name: string;
  questions: {
    question: string;
    answers: string[];
  }[];
}

function processText(text: string): QuizData {
  try {
    const quizName = text.match(/Title: (.*)/)?.[1] || '';

    const questionsRaw = text.match(/Question\d+: (.*?)\n(.*?)\n(.*?)\n(.*?)\n/g) || [];

    const questions = questionsRaw.map(questionRaw => {
      const questionParts = questionRaw.split("\n").filter(x => x);
      const question = questionParts[0];
      const answers = [
        questionParts[1].split("- ")[1],
        questionParts[2].split("- ")[1],
        questionParts[3].split("- ")[1]
      ];
      return { question, answers };
    }).filter(questionObj => questionObj.answers.length === 3);

    const quizData: QuizData = {
      quiz_name: quizName,
      questions
    };
    return quizData;
  } catch (e){
    return {
      quiz_name: "",
      questions: []
    }
  }
}

export default function ClientSection() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("Create a Trivia or Knowledge Test for Phish that educates customers about create a trivia experience about how well you know the band Phish");
  const [prompt, setPrompt] = useState("Q: {input} Create a 5 question personality quiz with 3 multiple choice answers of less than four words in JSON");
  const [response, setResponse] = useState<String>("");
  const [questions, setQuestions] = useState<{
    question: string;
    answers: string[];
  }[]>([])

  const [openAiKey, setOpenAiKey] = useState("");

  const [question1] = useState({
    question: "What is LinkedIn?",
    answers: [
      "A social networking site for professionals",
      "A dating app",
      "A video game"
    ]
  });

  //const prompt = `Q: {input} Create a 5 question personality quiz with 3 multiple choice answers of less than four words in JSON`;

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.replace("{input}", input),
        key: openAiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Update the document title using the browser API
    const response2 = processText(response as string)
    setQuestions(response2.questions)
  }, [response]);

  return (
    <div className="w-full max-w-6xl">
      <div className="m-4">
        <input className="focus:ring-neu w-full rounded-md border border-neutral-400
         p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900" value={openAiKey} onChange={(e) => setOpenAiKey(e.target.value)} type="password" placeholder="OpenAi Key"/>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        maxLength={1000}
        className="focus:ring-neu w-full rounded-md border border-neutral-400
         p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900"
        placeholder={"input or task"}
      />
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        maxLength={1300}
        className="focus:ring-neu w-full rounded-md border border-neutral-400
         p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900"
        placeholder={"prompt"}
      />
      {!loading ? (
        <button
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-black/80"
          onClick={(e) => generateResponse(e)}
        >
          Generate Response &rarr;
        </button>
      ) : (
        <button
          disabled
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
        >
          <div className="animate-pulse font-bold tracking-widest">...</div>
        </button>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 p-4">
          <div className="App min-h-screen bg-gray-100 flex items-center justify-center  gap-6 flex-wrap">
            {questions && questions.map((question, index) => {
              return (<QuestionCard question={question.question} answers={question.answers} key={index}/>)
            })}                
          </div>
        </div>
        <div className="bg-gray-200 p-4">
          {response && (
            <div className="mt-8 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
              <textarea 
                value={response as string} 
                readOnly
                rows={20}
                maxLength={5000}
                className="focus:ring-neu w-full rounded-md border border-neutral-400
                p-4 text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-900"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}