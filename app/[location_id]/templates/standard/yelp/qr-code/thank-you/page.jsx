"use client";

const CheckIcon = () => (
  <svg
    className="w-16 h-16 text-green-500 mx-auto"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4L12 14.01L9 11.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ConfettiPiece = ({ color, style }) => (
  <div className={`absolute w-2 h-2 ${color} rotate-45`} style={style}></div>
);

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {[...Array(20)].map((_, i) => (
        <ConfettiPiece
          key={i}
          color={
            ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"][
              i % 4
            ]
          }
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animation: `fall ${5 + Math.random() * 5}s linear infinite`,
          }}
        />
      ))}

      <div className="mb-6">
        <CheckIcon />
      </div>

      <h1 className="text-4xl font-bold mb-2">
        Thank you for your feedback! 🙏
      </h1>

      <p className="text-gray-600 mb-8 max-w-2xl">
        We truly appreciate you taking the time to share your experience with
        us. Your insights are invaluable and will help us improve our services.
        We're committed to addressing the issues you've raised.
      </p>

      <h2 className="text-2xl font-bold">
        We'll be in touch within 48 hours to discuss your concerns
      </h2>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
