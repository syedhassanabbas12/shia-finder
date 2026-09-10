import { useAppState } from '../AppState';

export default function ModeratorQueue() {
  const { editQueue } = useAppState();

  if (!editQueue) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>
          Moderator tools need an account with moderator rights — turn on "Moderator tools" from the You tab once
          Supabase is wired up.
        </p>
      </div>
    );
  }

  const { queue, approve, reject } = editQueue;

  return (
    <div className="screen-scroll">
      <div className="screen-header" style={{ paddingTop: 40 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 4 }}>
          Moderator
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22 }}>Review queue</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)' }}>{queue.length} waiting</div>
        </div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {queue.map((q) => (
          <div className="card" key={q.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="card-kicker">{q.field}</div>
              <div style={{ fontSize: 10.5, color: 'var(--color-neutral-700)' }}>{new Date(q.submittedAt).toLocaleDateString()}</div>
            </div>
            <div className="card-title">{q.mosqueId}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13 }}>
              <div><span style={{ fontSize: 9.5, color: 'var(--color-neutral-700)', textTransform: 'uppercase' }}>was </span><span style={{ textDecoration: 'line-through', color: 'var(--color-neutral-700)' }}>{q.fromValue}</span></div>
              <div><span style={{ fontSize: 9.5, color: 'var(--color-accent)', textTransform: 'uppercase' }}>now </span><span style={{ color: 'var(--color-accent-700)' }}>{q.toValue}</span></div>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--color-neutral-700)', borderLeft: '1px solid var(--color-divider)', paddingLeft: 9, fontStyle: 'italic' }}>{q.source}</div>
            <div className="card-meta">{q.submittedBy}</div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => approve(q.id)}>Confirm</button>
              <button className="btn btn-secondary" onClick={() => reject(q.id)}>Not yet</button>
            </div>
          </div>
        ))}
        {queue.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 18px', border: '1px solid var(--color-divider)', borderRadius: 4 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, marginBottom: 6 }}>All caught up</div>
            <div style={{ fontSize: 12.5, color: 'var(--color-neutral-700)' }}>
              Jazak Allah. Records lose their verified mark after a year and come back here for a fresh look.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
