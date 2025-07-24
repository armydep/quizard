import { useState } from 'react';

export function useQuestion() {
  const [question, setQuestion] = useState('');
  const [keywords, setKeywords] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const fetchRandomQuestion = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/random-question', { headers });
    const data = await res.json();
    setQuestion(data.Question);
    setAnswer('');
    setSubmitStatus('idle');
  };

  const fetchQuestionByKeywords = async (token?: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/question-by-keyword', {
      method: 'POST',
      headers,
      body: JSON.stringify({ keywords: keywords.split(',').map(k => k.trim()) }),
    });
    const data = await res.json();
    setQuestion(data.question);
    setAnswer('');
    setSubmitStatus('idle');
  };

  const submitAnswer = async (token?: string) => {
    if (!question || !answer) return;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/submit-answer', {
      method: 'POST',
      headers,
      body: JSON.stringify({ question, answer }),
    });
    const data = await res.json();
    setSubmitStatus(data.correct ? 'correct' : 'wrong');
  };

  const logout = () => {
    localStorage.removeItem('jwt');
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
    logout,
  };
}