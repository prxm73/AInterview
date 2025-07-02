"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionSection from "./_components/QuestionSection";
import dynamic from "next/dynamic";

// ✅ Dynamic import with SSR disabled
const RecordAnswerSection = dynamic(
  () => import("./_components/RecordAnswerSection"),
  { ssr: false }
);

function StartInterview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);

  // ✅ Shared state to sync active question
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const GetInterviewDetails = async (id) => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, id));

    const interview = result?.[0];
    if (interview) {
      setInterviewData(interview);

      try {
        const parsed = JSON.parse(interview.jsonMockResp);
        console.log("✅ Questions loaded:", parsed);

        const questions = Array.isArray(parsed) ? parsed : parsed?.questions;
        if (Array.isArray(questions)) {
          setMockInterviewQuestion(questions);
        } else {
          console.warn("⚠️ Unexpected JSON structure", parsed);
        }
      } catch (err) {
        console.error("❌ Failed to parse jsonMockResp:", err);
      }
    }
  };

  return (
    <div className="px-4 py-4">
      <h2 className="text-2xl font-bold text-center mb-4">Interview Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Questions */}
        {mockInterviewQuestion && Array.isArray(mockInterviewQuestion) ? (
          <QuestionSection
            mockInterviewQuestion={mockInterviewQuestion}
            interviewData={interviewData}
            activeIndex={activeIndex}            // ✅ passed
            setActiveIndex={setActiveIndex}      // ✅ passed
          />
        ) : (
          <div className="text-muted-foreground">Loading questions...</div>
        )}

        {/* Recording */}
        <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
          <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeIndex={activeIndex}            // ✅ passed
            interviewData={interviewData}
          />
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
