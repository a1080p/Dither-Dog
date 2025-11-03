"use client";

import { useState } from "react";

export function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
      <h3 className="text-2xl font-bold mb-4">Interactive Counter</h3>
      <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        {count}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCount(count - 1)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Increase
        </button>
      </div>
    </div>
  );
}
