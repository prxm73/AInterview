"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getGeminiResponse } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { Usertable } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { eq, and } from "drizzle-orm";
import useSpeechToText from "react-hook-speech-to-text";

function RecordAnswerSection({ mockInterviewQuestion, activeIndex, interviewData }) {
  const { user } = useUser();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [micPermission, setMicPermission] = useState(true);
  const [webCamAvailable, setWebCamAvailable] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = SpeechRecognition
    ? useSpeechToText({ continuous: true, useLegacyResults: false })
    : {
        error: null,
        interimResult: "",
        isRecording: false,
        results: [],
        startSpeechToText: () => {},
        stopSpeechToText: () => {},
      };

  useEffect(() => {
    if (error) alert(`Speech Recognition Error: ${error.message}`);
  }, [error]);

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((micStream) => {
        stream = micStream;
        setMicPermission(true);
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.onended = () => {
            setMicPermission(false);
            alert("Microphone was turned off. Please re-enable it.");
            stopSpeechToText();
          };
        }
      })
      .catch(() => {
        alert("Microphone permission denied.");
        setMicPermission(false);
      });

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (micPermission) setWebCamEnabled(true);
  }, [micPermission]);

  useEffect(() => {
    if (!webCamEnabled) return;
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setWebCamAvailable(videoInputDevices.length > 0);
      })
      .catch(() => setWebCamAvailable(false));
  }, [webCamEnabled]);

  useEffect(() => {
    if (!isRecording && results.length > 0) {
      const finalTranscript = results.map((r) => r.transcript).join(" ");
      setUserAnswer(finalTranscript);

      if (finalTranscript.length < 10) {
        toast("Answer too short, please re-record.");
        return;
      }

      const generateFeedback = async () => {
        try {
          setLoading(true);
          const questionObj = mockInterviewQuestion?.[activeIndex];
          const question = questionObj?.Question || "Unknown question";
          const correctAns = questionObj?.Answer || "N/A";

          const prompt = `Question: ${question}, User Answer: ${finalTranscript}. Give rating out of 5 and feedback in JSON format.`;

          const result = await getGeminiResponse(prompt);
          const parsed = JSON.parse(result.replace(/```json|```/g, "").trim());

          await db.delete(Usertable).where(
            and(
              eq(Usertable.mockIdRef, interviewData?.mockId),
              eq(Usertable.questionIndex, String(activeIndex))
            )
          );

          await db.insert(Usertable).values({
            mockIdRef: interviewData?.mockId,
            questionIndex: String(activeIndex),
            question,
            correctAns,
            userAns: finalTranscript,
            feedback: parsed.feedback,
            rating: parsed.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          });

          toast("✅ Answer recorded and evaluated.");
          setResults([]);
        } catch (err) {
          console.error("Error saving answer:", err);
          toast("❌ Failed to save answer.");
        } finally {
          setLoading(false);
        }
      };

      generateFeedback();
    }
  }, [isRecording, results, activeIndex]);

  const handleRecordClick = () => {
    if (isRecording) stopSpeechToText();
    else {
      setUserAnswer("");
      startSpeechToText();
    }
  };

  if (!SpeechRecognition) {
    return (
      <div className="text-center p-4 text-red-600">
        ❌ Speech recognition is not supported in your browser.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {webCamEnabled && webCamAvailable ? (
        <Webcam mirrored style={{ width: 300, height: 300, borderRadius: 10 }} />
      ) : (
        <WebcamIcon className="text-muted-foreground w-40 h-40" />
      )}

      <div className="my-4 flex gap-4">
        <Button onClick={handleRecordClick} disabled={loading}>
          {loading ? "⏳ Saving..." : isRecording ? "⏹️ Stop" : "🎙️ Record"}
        </Button>

        {userAnswer && !isRecording && (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => {
              setUserAnswer("");
              startSpeechToText();
            }}
            className={loading ? "opacity-50 pointer-events-none" : ""}
          >
            🔁 Re-record
          </Button>
        )}
      </div>

      <div className="w-full max-w-xl">
        {isRecording && (
          <div className="p-4 bg-gray-100 rounded">
            {results.map((r, i) => (
              <p key={i}>{r.transcript}</p>
            ))}
            {interimResult && <p className="italic text-gray-500">{interimResult}</p>}
          </div>
        )}
        {!isRecording && userAnswer && (
          <div className="p-4 bg-green-100 rounded">
            <strong>✅ Saved Answer:</strong>
            <p>{userAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecordAnswerSection;
