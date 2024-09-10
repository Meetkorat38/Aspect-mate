"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-white mb-6">Aspect Mate</h1>
        <p className="text-gray-300 mb-8">
          Enhance your media management effortlessly with our tools for
          transforming and managing images and videos.
        </p>
        <button
          className="btn btn-primary btn-lg w-full"
          onClick={() => router.push("/home")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
