import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => setMsg(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <div>
      <h1>Workify</h1>
      <p>{msg || 'Loading...'}</p>
    </div>
  );
}

export default App;
