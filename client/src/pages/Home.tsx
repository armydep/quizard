import { useQuestion } from '../hooks/useQuestion';

export default function Home() {
  const {
    question,
    keywords,
    answer,
    setKeywords,
    setAnswer,
    fetchRandomQuestion,
    fetchQuestionByKeywords,
  } = useQuestion();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8 }}>
      <h2>Quizard</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={fetchRandomQuestion} style={{ marginRight: '1rem' }}>Random Question</button>
        <button onClick={fetchQuestionByKeywords}>Question by Keyword</button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter keywords (comma separated)"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      {question && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Question:</strong>
          <div style={{ margin: '0.5rem 0' }}>{question}</div>
          <textarea
            placeholder="Your answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ width: '100%', minHeight: 80, padding: '0.5rem' }}
          />
        </div>
      )}
    </div>
  );
}