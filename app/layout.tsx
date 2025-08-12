
import './globals.css';
import NotifBell from "@/components/NotifBell";

export const metadata = {
  title: 'TalentPort — práca a nábor v EÚ',
  description: 'Kandidáti zadarmo, zamestnávatelia platia len za inzerát.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const userId = "auth-user-id"; // TODO: replace with real auth user id
  return (
    <html lang="sk">
      <body>
        <header>
          <div className="container row">
            <div className="row" style={gap:10}>
              <strong style={fontSize:22}>Talentport</strong>
              <span aria-hidden="true" style={width:12,height:12,borderRadius:'50%',background:'#F9BD4D',display:'inline-block'}/>
            </div>
            <nav className="nav">
              <a href="/">Domov</a>
              <a href="/jobs">Pracovné ponuky</a>
              <a href="/employers">Pre zamestnávateľov</a>
              <a href="/pricing" target="_blank" rel="noopener">Cenník (nový tab)</a>
            </nav>
            <div className="row" style={gap:8}>
              <NotifBell userId={userId} />
              <button className="btn ghost" onClick={() => {
                const next = document.documentElement.dataset.theme === 'light' ? '' : 'light';
                if(next) document.documentElement.dataset.theme = next; else document.documentElement.removeAttribute('data-theme');
              }>
                Tmavá/Svetlá
              </button>
              <a className="btn solid" href="/employers">Pridať ponuku</a>
            </div>
          </div>
        </header>
        {children}
        <footer className="footer">© 2025 TalentPort</footer>
      </body>
    </html>
  );
}
