import './globals.css';

export const metadata = {
  title: 'OneGoodDeed - Transparent Donation Platform',
  description: 'Support verified organisations and their charitable campaigns. Every donation is tracked transparently on the blockchain.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="charity-background pattern-overlay min-h-screen">
        <div className="floating-hearts">
          <div className="heart">❤️</div>
          <div className="heart">💚</div>
          <div className="heart">🤝</div>
          <div className="heart">❤️</div>
          <div className="heart">💙</div>
          <div className="heart">🤝</div>
          <div className="heart">💚</div>
          <div className="heart">❤️</div>
          <div className="heart">💙</div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
