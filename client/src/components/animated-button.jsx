export default function AnimatedButton({ onClick, children = "Get Started" }) {
  return (
    <div className="container-button">
      <div className="hover"></div>
      <div className="bt-1"></div>
      <div className="bt-2"></div>
      <div className="bt-3"></div>
      <div className="bt-4"></div>
      <div className="bt-5"></div>
      <div className="bt-6"></div>
      <button className="animated-button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
