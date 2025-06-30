"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lightbulb, Volume2 } from "lucide-react";
import { useParams } from "next/navigation";

function QuestionSection({ mockInterviewQuestion, activeIndex, setActiveIndex }) {
  const { interviewId } = useParams();
  const current = mockInterviewQuestion?.[activeIndex];
  const [showAnswer, setShowAnswer] = React.useState(false);

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No questions found.</div>;
  }

  const textToSpeech = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="p-5 border rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-3 mb-6">
        {mockInterviewQuestion.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setShowAnswer(false);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
              activeIndex === index
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Question {index + 1}
          </button>
        ))}
      </div>

      <div className="p-6 border rounded-md bg-muted shadow-sm min-h-[250px] transition-all duration-300">
        <h2 className="text-xl font-semibold mb-4">Question #{activeIndex + 1}</h2>
        <p className="text-gray-900 mb-4">{current?.Question || "Invalid question"}</p>

        <div className="mt-2 flex gap-2.5 items-center">
          <Volume2 onClick={() => textToSpeech(current?.Question)} className="cursor-pointer" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            {showAnswer ? "Hide Answer" : "Show Sample Answer"}
          </Button>
        </div>

        {showAnswer && (
          <div className="mt-4 bg-sky-100 border-l-4 border-sky-500 rounded-md p-4">
            <p className="text-sm text-sky-900 font-semibold mb-1">Sample Answer:</p>
            <p className="text-gray-800 leading-relaxed">{current?.Answer}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          className="w-1/3"
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0}
        >
          ⬅️ Previous
        </Button>

        {activeIndex === mockInterviewQuestion.length - 1 ? (
          <Link href={`/dashboard/interview/${interviewId}/feedback`}>
            <Button className="w-full">✅ End Interview</Button>
          </Link>
        ) : (
          <Button
            className="w-1/3"
            onClick={() => {
              setActiveIndex((prev) => prev + 1);
              setShowAnswer(false);
            }}
          >
            Next ➡️
          </Button>
        )}
      </div>

      <div className="w-full flex flex-col mt-6 gap-3.5 justify-left min-h-[150px] rounded-lg border p-6 bg-blue-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Lightbulb />
          <strong>Information</strong>
        </div>
        <div>
          {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
            "This mock interview consists of multiple questions. You'll receive a report based on your answers. Note: We never record your video. Webcam access can be disabled anytime."}
        </div>
      </div>
    </div>
  );
}

export default QuestionSection;
