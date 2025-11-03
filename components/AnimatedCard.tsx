"use client";

import { useState } from "react";

interface AnimatedCardProps {
  title: string;
  description: string;
}

export function AnimatedCard({ title, description }: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="border border-gray-200 dark:border-gray-800 rounded-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-purple-500 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transition-transform duration-300 ${
            isHovered ? "rotate-180 scale-110" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-4">
        <div
          className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
            isHovered ? "w-full" : "w-0"
          }`}
        />
      </div>
    </div>
  );
}
