import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
        <Home />
      </div>
    </AuthProvider>
  );
}
