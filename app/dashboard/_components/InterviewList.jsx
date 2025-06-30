"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { desc, eq } from "drizzle-orm";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function InterviewList() {
  const { user, isSignedIn } = useUser();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      getInterviewList();
    }
  }, [isSignedIn, user]);

  const getInterviewList = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(
          eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress)
        )
        .orderBy(desc(MockInterview.id));

      setInterviews(result);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-semibold text-xl mb-4">🧾 Previous Interviews</h2>

      {interviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">No interviews found.</p>
      ) : (
        <ul className="space-y-3">
          {interviews.map((interview) => (
            <li
              key={interview.mockId}
              className="p-4 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="items-center font-medium text-base">
                    Interview Role: {interview.jobPosition}
                  </h3>
                  <p className="items-center text-sm text-muted-foreground">
                    Created At: {interview.createdAt}
                  </p>
                </div>

                <div className="items-center flex gap-2">
                  <Button>
                    <Link
                      href={`/dashboard/interview/${interview.mockId}/feedback`}
                    >
                      <span className="items-center text-sm">
                        View Feedback →
                      </span>
                    </Link>
                  </Button>

                  <Link href={`/dashboard/interview/${interview.mockId}/start`}>
                    <Button variant="ghost" className={"border"}>
                      <h2 className="text-medium">Restart Interview</h2>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InterviewList;
