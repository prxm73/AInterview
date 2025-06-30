"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { Usertable, MockInterview } from "@/utils/schema";
import { useParams, useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronRight, HomeIcon, RotateCcw } from "lucide-react";
import Link from "next/link";

function Feedback() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [jobRole, setJobRole] = useState("");

  useEffect(() => {
    if (interviewId) {
      getFeedback();
      getRole();
    }
  }, [interviewId]);

  const getFeedback = async () => {
    try {
      const data = await db
        .select()
        .from(Usertable)
        .where(eq(Usertable.mockIdRef, interviewId));
      setResults(data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const getRole = async () => {
    try {
      const roleData = await db
        .select({ jobPosition: MockInterview.jobPosition })
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (roleData && roleData.length > 0) {
        setJobRole(roleData[0].jobPosition);
      }
    } catch (err) {
      console.error("Error fetching job role:", err);
    }
  };

  const sortedResults = [...results].sort(
    (a, b) => Number(a.questionIndex) - Number(b.questionIndex)
  );

  const averageRating = () => {
    const ratings = sortedResults
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r));
    if (ratings.length === 0) return "N/A";
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const handleRestart = () => {
    router.push(`/dashboard/interview/${interviewId}/start`);
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations! 🎉</h2>
      <h3 className="text-xl font-bold mt-2">
        Role: <span className="text-blue-700">{jobRole || interviewId}</span>
      </h3>
      <h3 className="text-xl font-bold mt-2">Here is your interview rating:</h3>
      <h3 className="text-primary text-lg my-2">
        Your Interview Rating: <strong>{averageRating()} / 5</strong>
      </h3>

      <p className="mt-6 font-medium">
        Find below interview questions, correct answers, your answers, and feedback:
      </p>

      <div className="mt-6 space-y-4">
        {sortedResults.map((entry, idx) => (
          <Collapsible key={idx} className="border rounded bg-white shadow-sm">
            <CollapsibleTrigger className="w-full flex justify-between px-4 py-2 font-semibold text-sm hover:bg-gray-100">
              <span>
                Q{idx + 1}: {entry.question?.slice(0, 60)}...
              </span>
              <ChevronRight className="group-data-[state=open]:rotate-90 transition-transform" />
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 py-3 border-t text-sm">
              <p>
                <strong>❓ Question:</strong> {entry.question}
              </p>
              <p>
                <strong>✔️ Correct Answer:</strong> {entry.correctAns}
              </p>
              <p>
                <strong>🗣️ Your Answer:</strong> {entry.userAns}
              </p>
              <p>
                <strong>📝 Feedback:</strong>{" "}
                {typeof entry.feedback === "string"
                  ? JSON.parse(entry.feedback).overall
                  : entry.feedback?.overall || "No feedback"}
              </p>
              <p>
                <strong>⭐ Rating:</strong> {entry.rating ?? "N/A"} / 5
              </p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/dashboard">
          <Button>
            <HomeIcon className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>

        <Button variant="secondary" onClick={handleRestart}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart Interview
        </Button>
      </div>
    </div>
  );
}

export default Feedback;
