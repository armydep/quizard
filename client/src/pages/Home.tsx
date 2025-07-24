import { useQuestion } from '../hooks/useQuestion';

function getToken() {
  return localStorage.getItem('jwt');
}

export default function Home() {
  const {
    question,
    keywords,
    answer,
    setKeywords,
    setAnswer,
    fetchRandomQuestion,
    fetchQuestionByKeywords,
    submitAnswer,
    submitStatus,
    tries,
    time,
    revealedAnswer,
    showAnswer,
    revealedComments,
    showComments,
    commentsButtonDisabled,
  } = useQuestion();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8 }}>
      <h2>Quizard</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => fetchRandomQuestion(getToken() ?? undefined)} style={{ marginRight: '1rem' }}>Random Question</button>
        <button onClick={() => fetchQuestionByKeywords(getToken() ?? undefined)}>Question by Keyword</button>
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
            disabled={submitStatus === 'correct'}
          />
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => {
                submitAnswer(getToken() ?? undefined);
              }}
              disabled={!answer || submitStatus === 'correct' || !!revealedAnswer}
              style={{ padding: '0.5rem 1.5rem' }}
            >
              Submit
            </button>
            <button
              onClick={() => showAnswer(getToken() ?? undefined)}
              style={{ padding: '0.5rem 1.5rem' }}
              disabled={!!revealedAnswer}
            >
              Show Answer
            </button>
            <button
              onClick={() => showComments(getToken() ?? undefined)}
              style={{ padding: '0.5rem 1.5rem' }}
              disabled={!question || commentsButtonDisabled}
            >
              Comments
            </button>
            {submitStatus === 'correct' && (
              <span style={{ color: 'green' }}>
                Correct
                {typeof tries === 'number' && (
                  <span style={{ marginLeft: 10 }}>| Tries: {tries}</span>
                )}
                {typeof time === 'number' && (
                  <span style={{ marginLeft: 10 }}>| Time: {time}s</span>
                )}
              </span>
            )}
            {submitStatus === 'wrong' && <span style={{ color: 'red' }}>Wrong</span>}
          </div>
          {revealedAnswer && (
            <div style={{ marginTop: '1rem', color: '#333', background: '#f0f0f0', padding: '0.75rem', borderRadius: 4 }}>
              <strong>Answer:</strong> {revealedAnswer}
            </div>
          )}
          {revealedComments && (
            <div style={{ marginTop: '1rem', color: '#333', background: '#e0e0ff', padding: '0.75rem', borderRadius: 4 }}>
              <strong>Comments:</strong> {revealedComments}
            </div>
          )}
        </div>
      )}
    </div>
  );
}