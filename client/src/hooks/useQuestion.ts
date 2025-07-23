import { useState } from 'react';

export function useQuestion() {
  const [question, setQuestion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [answer, setAnswer] = useState('');

  const fetchRandomQuestion = async () => {
    const res = await fetch('/api/random-question');
    const data = await res.json();
    setQuestion(data.question);
    setAnswer('');
  };

  const fetchQuestionByKeywords = async () => {
    const res = await fetch('/api/question-by-keyword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: keywords.split(',').map(k => k.trim()) }),
    });
    const data = await res.json();
    setQuestion(data.question);
    setAnswer('');
  };

  return {
    question,
    keywords,
    answer,
    setKeywords,
    setAnswer,
    fetchRandomQuestion,
    fetchQuestionByKeywords,
  };
}