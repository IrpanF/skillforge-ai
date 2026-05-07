"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [lesson, setLesson] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [teachBack, setTeachBack] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);

    const res = await fetch("/api/roadmap", {
      method: "POST",
      body: JSON.stringify({ goal }),
    });

    const data = await res.json();

    const roadmapSteps = data.roadmap
      .split("\n")
      .filter((line: string) => line.trim() !== "");

    setSteps(roadmapSteps);
    localStorage.setItem("steps", JSON.stringify(roadmapSteps));
    localStorage.setItem("goal", goal);

    setLoading(false);
  };

  const learnTopic = async (topic: string) => {
    setSelectedTopic(topic);

    setLoading(true);

    const res = await fetch("/api/learn", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();

    setLesson(data.lesson);
    localStorage.setItem("lesson", data.lesson);

    setLoading(false);
  };

  const submitTeachBack = async () => {
    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        topic: selectedTopic,
        answer: teachBack,
      }),
    });

    const data = await res.json();

    setFeedback(data.feedback);
    localStorage.setItem("feedback", data.feedback);

    setLoading(false);
  };
  
  useEffect(() => {
    const savedSteps = localStorage.getItem("steps");
    const savedLesson = localStorage.getItem("lesson");
    const savedGoal = localStorage.getItem("goal");
    const savedFeedback = localStorage.getItem("feedback");

    if (savedFeedback) {
      setFeedback(savedFeedback);
    }

    if (savedSteps) {
      setSteps(JSON.parse(savedSteps));
    }

    if (savedLesson) {
      setLesson(savedLesson);
    }

    if (savedGoal) {
      setGoal(savedGoal);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 text-white">
      <div className="grid md:grid-cols-[300px_1fr] min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="border-r border-gray-800 p-6">
          <h1 className="text-3xl font-bold text-purple-400">
            SkillForge AI
          </h1>

          <div className="mt-8 bg-gray-900/60 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              
              <div className="relative w-16 h-16">
                <Image
                  src="/mentor.png"
                  alt="ForgeSensei"
                  fill
                  className="rounded-full object-cover border border-purple-500"
                />
              </div>

              <div>
                <h2 className="font-bold text-lg">ForgeSensei</h2>
                <p className="text-sm text-gray-400">
                  AI Learning Mentor
                </p>
              </div>
            </div>

            <p className="mt-4 text-gray-300 text-sm leading-relaxed">
              I will help you learn faster using personalized roadmaps,
              structured lessons, and active learning.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Powered by AI • Next.js • OpenRouter
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="p-8">

          <div className="max-w-4xl mx-auto">

            <h2 className="text-5xl font-bold leading-tight">
              Learn Smarter <br />
              with AI Guidance
            </h2>

            <p className="mt-4 text-gray-400 max-w-2xl">
              Generate personalized learning roadmaps, explore lessons,
              and accelerate mastery with your AI mentor.
            </p>

            {/* INPUT */}
            <div className="mt-8 bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
              
              <textarea
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white"
                placeholder="What do you want to learn?"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />

              <button
                onClick={generateRoadmap}
                className="mt-4 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold"
              >
                Generate AI Roadmap
              </button>
              
              <button
                onClick={() => {
                  localStorage.clear();
                  location.reload();
                }}
                className="ml-3 mt-4 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold"
              >
                Reset Progress
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="mt-6 text-purple-400">
                ForgeSensei is thinking...
              </div>
            )}

            {/* ROADMAP */}
            {steps.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-5">
                  Learning Roadmap
                </h3>

                <div className="grid gap-4">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => learnTopic(step)}
                      className="bg-gray-900/70 border border-gray-800 hover:border-purple-500 hover:bg-purple-900/20 transition p-5 rounded-2xl text-left"
                    >
                      <p className="text-purple-400 text-sm">
                        STEP {index + 1}
                      </p>

                      <h4 className="text-lg font-semibold mt-1">
                        {step}
                      </h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LESSON */}
            {lesson && (
              <div className="mt-10 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 whitespace-pre-line">
                
                <h3 className="text-2xl font-bold mb-4">
                  Lesson Session
                </h3>

                <div className="text-gray-300 leading-relaxed">
                  {lesson}
                </div>
              </div>
            )}

            {teachBack && (
              <div className="mt-8 bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
  
                <h3 className="text-2xl font-bold mb-3">
                  Teach Back Exercise
                </h3>

                <p className="text-gray-400 mb-4">
                  Explain the concept in your own words.
                </p>

                <textarea
                  className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white"
                  placeholder="Write your explanation here..."
                  value={teachBack}
                  onChange={(e) => setTeachBack(e.target.value)}
                />

                <button
                  onClick={submitTeachBack}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold"
                >
                  Get AI Feedback
                </button>
              </div>
            )}
            
            {feedback && (
              <div className="mt-8 bg-gray-900/70 border border-purple-500/30 rounded-2xl p-6 whitespace-pre-line">
                
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  ForgeSensei Feedback
                </h3>

                <div className="text-gray-300 leading-relaxed">
                  {feedback}
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}