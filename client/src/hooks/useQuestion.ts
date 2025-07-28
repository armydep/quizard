import { useState } from 'react';

export function useQuestion() {
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [keywords, setKeywords] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const showAnswer = async (token?: string) => {
    if (!questionId) return;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/show-answer', {
      method: 'POST',
      headers,
      body: JSON.stringify({ questionId }),
    });
    const data = await res.json();
    setRevealedAnswer(data.answer || null);
  };
  const [tries, setTries] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [revealedComments, setRevealedComments] = useState<string | null>(null);
  const [commentsButtonDisabled, setCommentsButtonDisabled] = useState(false);

  const showComments = async (token?: string) => {
    if (!questionId) return;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/show-comments', {
      method: 'POST',
      headers,
      body: JSON.stringify({ questionId }),
    });
    const data = await res.json();
    setRevealedComments(data.comments || null);
    setCommentsButtonDisabled(true);
  };

  const fetchRandomQuestion = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/random-question', { headers });
    const data = await res.json();
    setQuestion(data.Question);
    setQuestionId(data.QuestionId);
    setAnswer('');
    setSubmitStatus('idle');
    setRevealedAnswer(null);
    setRevealedComments(null);
    setCommentsButtonDisabled(false);
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
      body: JSON.stringify({ questionId, answer }),
    });
    const data = await res.json();
    setSubmitStatus(data.correct ? 'correct' : 'wrong');
    if (data.correct) {
      setTries(typeof data.tries === 'number' ? data.tries : null);
      setTime(typeof data.time === 'number' ? data.time : null);
    }
  };

  return {
    question,
    questionId,
    keywords,
    answer,
    setKeywords,
    setAnswer,
    fetchRandomQuestion,
    submitAnswer,
    submitStatus,
    tries,
    time,
    revealedAnswer,
    showAnswer,
    revealedComments,
    showComments,
    commentsButtonDisabled,
  };
}