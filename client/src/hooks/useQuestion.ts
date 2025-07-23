import { useState } from 'react';

export function useQuestion() {
  const [question, setQuestion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const fetchRandomQuestion = async () => {
    const res = await fetch('/api/random-question');
    const data = await res.json();
    setQuestion(data.question);
    setAnswer('');
    setSubmitStatus('idle');
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
    setSubmitStatus('idle');
  };

  const submitAnswer = async () => {
    if (!question || !answer) return;
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    setSubmitStatus(data.correct ? 'correct' : 'wrong');
  };

  return {
    question,
    keywords,
    answer,
    setKeywords,
    setAnswer,
    fetchRandomQuestion,
    fetchQuestionByKeywords,
    submitAnswer,
    submitStatus,
  };
}