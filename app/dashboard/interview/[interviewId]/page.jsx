"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Interview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

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
    setInterviewData(result?.[0]);
  };

  return (
    <div className="my-5 flex justify-center items-center flex-col px-4">
      <h2 className="font-bold text-3xl mb-12 text-center">
        Let's Get Started
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl min-h-[300px]">
        {/* Interview Details */}
        <div className="w-full flex flex-col justify-between items-center min-h-[300px]">
          {interviewData && (
            <div className="w-full rounded-lg border p-6 bg-muted shadow-sm h-full">
              <h2 className="text-xl mb-6">
                <strong>Job Role/Position:</strong> {interviewData.jobPosition}
              </h2>
              <h2 className="text-xl mb-6">
                <strong>Job Description/Tech Stack:</strong>{" "}
                {interviewData.jobDesc}
              </h2>
              <h2 className="text-xl">
                <strong>Experience:</strong> {interviewData.jobExp}
              </h2>
            </div>
          )}
          <div className="w-full flex flex-col mt-6 gap-3.5 justify-left min-h-[200px] rounded-lg border p-6 bg-amber-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb />
              <strong>Information</strong>
            </div>
            <div>
              {process.env.NEXT_PUBLIC_INFORMATION ||
                "This mock interview consists of 5 questions. You'll receive a report based on your answers. Note: We never record your video. Webcam access can be disabled anytime."}
            </div>
          </div>
        </div>

        {/* Webcam */}
        <div className="w-full min-h-[500px] border border-muted-foreground rounded-lg flex flex-col items-center justify-center p-6">
          {webCamEnabled ? (
            <Webcam
              mirrored
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              style={{
                height: 325,
                width: 325,
                borderRadius: 12,
              }}
            />
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <WebcamIcon className="h-[200px] w-[200px] text-muted-foreground my-4" />
            </div>
          )}

          {/* Buttons stacked but same width */}
          <Button
            variant="ghost"
            className="mt-6 w-full"
            onClick={() => {
              console.log("🔘 Enabling webcam...");
              setWebCamEnabled(true);
            }}
          >
            Enable Webcam and Mic
          </Button>

          <Link
            href={`/dashboard/interview/${interviewId}/start`}
            className="w-full"
          >
            <Button className="w-full mt-4">Start Interview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interview;
