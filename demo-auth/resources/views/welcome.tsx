export default function Welcome() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🚀 Nextlara - Laravel for Next.js</h1>
      <p>Your app is ready! This view is located in <code>resources/views/welcome.tsx</code></p>
      
      <h2>Quick Start:</h2>
      <ol>
        <li>Define routes in <code>routes/web.ts</code> or <code>routes/api.ts</code></li>
        <li>Create views in <code>resources/views</code></li>
        <li>Create controllers with <code>bob make:controller</code></li>
      </ol>

      <h2>Example Routes:</h2>
      <ul>
        <li><a href="/api/hello">/api/hello</a></li>
      </ul>
    </div>
  );
}
