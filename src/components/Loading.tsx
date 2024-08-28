export function Loading() {
  return (
    <div className="flex items-center space-x-5 text-gray-800">
      <div className="w-20 animate-spin">
        <svg
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-black"
        >
          <circle
            cx="400"
            cy="400"
            fill="none"
            r="200"
            stroke-width="40"
            stroke-dasharray="700 1400"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span className="text-xl">Loading...</span>
    </div>
  );
}
