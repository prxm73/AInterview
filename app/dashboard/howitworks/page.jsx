"use client";
import React from "react";

const steps = [
  {
    title: "1. Select a Role",
    description: "Choose the job role you want to practice for.",
  },
  {
    title: "2. Answer Interview Questions",
    description: "Speak your answers with webcam and mic support.",
  },
  {
    title: "3. Get Instant Feedback",
    description:
      "Our AI evaluates your response and provides a rating with improvement tips.",
  },
  {
    title: "4. Review & Retry",
    description:
      "Access all your past interviews, review feedback, and try again to improve.",
  },
];

function HowItWorksPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📖 How It Works</h2>
      <ol className="space-y-6">
        {steps.map((step, index) => (
          <li
            key={index}
            className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-primary"
          >
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default HowItWorksPage;
