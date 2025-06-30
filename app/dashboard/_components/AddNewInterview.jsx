"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getGeminiResponse } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import {useRouter} from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState(false);
  const [jobDesc, setJobDesc] = useState(false);
  const [jobExp, setJobExp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [JSONResp, setJSONResp] = useState(false);
const { user, isLoaded } = useUser();
const router = useRouter();


  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!isLoaded || !user) {
      alert("User info not loaded yet. Please wait a moment and try again.");
      setLoading(false);
      return;
    }

    console.log(jobPosition, jobDesc, jobExp);

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExp}, Depends on this information please give me ${process.env.NEXT_PUBLIC_NO_OF_QUESTIONS} Interview question with Answered in Json Format, Give Question and Answered as field in JSON`;

    try {
      const result = await getGeminiResponse(inputPrompt);

      const MockJSONResp = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("Raw AI Response:", MockJSONResp);

      try {
        console.log("Parsed JSON:", JSON.parse(MockJSONResp));
      } catch (jsonErr) {
        console.error("❌ Failed to parse JSON:", jsonErr);
        alert("Invalid JSON format returned by AI. Please try again.");
        setLoading(false);
        return;
      }

      setJSONResp(MockJSONResp);

      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJSONResp,
          jobPosition,
          jobExp: parseInt(jobExp),
          jobDesc,
          createdBy: user.primaryEmailAddress?.emailAddress ?? "anonymous",
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID: ", resp);
      setOpenDialog(false);
      router.push('/dashboard/interview/'+resp[0]?.mockId)
    } catch (err) {
      console.error("❌ Insert or AI failure:", err);
      alert("Something went wrong. Please check console logs.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md transition-all"
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your role/position and years of experience
                  </h2>
                  <div className="mt-5 my-2">
                    <label>Job Role/Position</label>
                    <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      required
                      className={"mt-2"}
                      placeholder="Ex. Full Stack Developer"
                    ></Input>
                  </div>
                  <div className="mt-5 my-2">
                    <label>Job Description/Tech Stack</label>
                    <Textarea
                      onChange={(event) => setJobDesc(event.target.value)}
                      required
                      className={"mt-2"}
                      placeholder="Ex. React, Node, Java"
                    ></Textarea>
                  </div>
                  <div className="mt-5 my-2">
                    <label>Year of Experience</label>
                    <Input
                      onChange={(event) => setJobExp(event.target.value)}
                      required
                      className={"mt-2"}
                      type="number"
                      placeholder="Ex. 5"
                    ></Input>
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating AI response
                      </>
                    )}
                    {!loading && <>Start Interview</>}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
