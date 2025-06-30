"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is AInterviewer?",
    answer:
      "AInterviewer is an AI-powered mock interview platform designed to help you practice and receive feedback on technical interviews.",
  },
  {
    question: "How does the interview process work?",
    answer:
      "You select a role, answer AI-generated questions via voice, and get instant feedback and a rating on your performance.",
  },
  {
    question: "Can I retake interviews?",
    answer:
      "Yes! You can retake interviews for any role multiple times to improve your performance and track progress.",
  },
  {
    question: "Is my data and performance saved?",
    answer:
      "Absolutely. All interviews are saved to your dashboard so you can review feedback, answers, and progress over time.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow-sm transition-all"
          >
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full font-medium text-left text-lg"
            >
              {faq.question}
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <p className="mt-2 text-gray-700 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
