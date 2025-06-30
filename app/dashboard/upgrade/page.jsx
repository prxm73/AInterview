"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Limited mock interviews", "Basic feedback", "Community support"],
  },
  {
    name: "Pro",
    price: "₹299/month",
    features: [
      "Unlimited interviews",
      "Detailed AI feedback",
      "Downloadable reports",
      "Priority support",
    ],
  },
];

function UpgradePage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🚀 Upgrade Your Plan</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-3xl font-bold my-2">{plan.price}</p>
            <ul className="text-sm space-y-1 mb-4">
              {plan.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <Button variant={plan.name === "Pro" ? "default" : "outline"}>
              {plan.name === "Pro" ? "Upgrade Now" : "Current Plan"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpgradePage;
