"use client";
import Link from "next/link";
import React from "react";

const steps = [
  {
    title: "1. Navigate to Dashboard",
    description:
      "Access your personal dashboard from the homepage after login.",
    image: "/1.png",
  },
  {
    title: "2. Select 'Add New'",
    description:
      "Click the 'Add New' button to begin setting up your mock session.",
    image: "/2.png",
  },
  {
    title: "3. Enter Interview Details And start the interview",
    description:
      "Specify the job role and any other required details, then click 'Start Interview', wait for the AI   to generate a question set then get redirected",
    image: "/3.png",
  },
  {
    title: "4. Confirm & Start Interview",
    description:
      "You'll be navigated to the setup screen. Confirm job role, and allow mic and camera permissions to begin.",
    image: "/4.png",
  },
  {
    title: "5. Navigate Questions",
    description:
      "Use number buttons or Prev/Next to move between questions. Use speaker icons to hear questions and sample answers.",
    image: "/5.png",
  },
  {
    title: "6. Record & Submit Answers",
    description:
      "Record your response, then save it. After a confirmation popup, proceed to next questions or end interview after Q5.",
    image: "/6.png",
  },
  {
    title: "7. View Feedback & Retry",
    description:
      "Access detailed feedback in the Feedback tab. Return to Home to find and retry previous interviews.",
    image: "/7.png",
  },
];

function HowItWorksPage() {
  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
      <div className="space-y-24">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            } items-center gap-8`}
          >
            <div className="md:w-1/2">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-auto rounded-xl shadow-md object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-lg">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-24 text-center">
        <Link href="/dashboard">
          <button className="px-6 py-3 text-white bg-primary hover:bg-primary/90 font-semibold text-lg rounded-xl shadow-md transition">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HowItWorksPage;
