import { useEffect } from 'react';
import { CardPage } from './components/CardPage';
import { HomePage } from './components/HomePage';
import { useUserParam } from './hooks/useUserParam';

export default function App() {
  const { user, navigate } = useUserParam();

  useEffect(() => {
    document.title = user ? `${user} 的 CNCF Wrapped` : 'CNCF Wrapped — 雲原生年度迷因卡';
  }, [user]);

  return (
    <div className="page">
      <button className="page-brand" onClick={() => navigate(null)} aria-label="回首頁">
        CNCF WRAPPED
      </button>

      {user ? <CardPage key={user} login={user} onNavigate={navigate} /> : <HomePage onSubmit={navigate} />}

      <footer className="page-foot">
        非官方粉絲專案 ・ 資料來自{' '}
        <a href="https://devstats.cncf.io" target="_blank" rel="noreferrer">
          CNCF DevStats
        </a>
      </footer>
    </div>
  );
}
