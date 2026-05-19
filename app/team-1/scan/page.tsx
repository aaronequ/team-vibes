"use client";

import React, { useState } from "react";

import CameraCapture from "../components/CameraCapture";
import { Ingredient } from "../components/IngredientChip";
import IngredientList from "../components/IngredientList";
import LoadingScanner from "../components/LoadingScanner";
import { useRouter } from "next/navigation";

type ScanState = "capturing" | "scanning" | "reviewing";
type ScanPhase = "preparing" | "uploading" | "analyzing" | "processing";

type ScannedIngredient = {
  name: string;
  category: string;
  confidence: number;
  emoji: string;
};

export default function ScanPage() {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<ScanState>("capturing");
  const [scanPhase, setScanPhase] = useState<ScanPhase>("preparing");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64Image: string) => {
    setCurrentState("scanning");
    setScanPhase("preparing");
    setError(null);

    try {
      setScanPhase("uploading");
      const response = await fetch("/team-1/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      setScanPhase("analyzing");

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      setScanPhase("processing");

      if (data.error) {
        throw new Error(data.error);
      }

      // Add unique IDs to the fetched ingredients
      const ingredientsWithIds = (
        (data.ingredients || []) as ScannedIngredient[]
      ).map((ing) => ({
        ...ing,
        id: Math.random().toString(36).substring(7),
      }));

      setIngredients(ingredientsWithIds);
      setCurrentState("reviewing");
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze the image. Please try again.");
      setCurrentState("capturing");
    }
  };

  const handleConfirmIngredients = (confirmedIngredients: Ingredient[]) => {
    // Store in session storage for the MVP
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "snapchef_ingredients",
        JSON.stringify(confirmedIngredients),
      );
    }
    router.push("/team-1/recipes");
  };

  const runDemo = () => {
    setIngredients([
      {
        id: "1",
        name: "Sweet Potato Wraps",
        category: "Pantry",
        confidence: 0.99,
        emoji: "🌯",
      },
      {
        id: "2",
        name: "Chicken Breast",
        category: "Meat",
        confidence: 0.95,
        emoji: "🍗",
      },
      {
        id: "3",
        name: "Yoghurt",
        category: "Dairy",
        confidence: 0.98,
        emoji: "🥣",
      },
      {
        id: "4",
        name: "Paprika",
        category: "Spices",
        confidence: 0.9,
        emoji: "🌶️",
      },
    ]);
    setCurrentState("reviewing");
  };

  return (
    <div className="fixed inset-0 z-50 bg-light flex flex-col h-[100dvh]">
      {currentState === "capturing" && (
        <>
          {error && (
            <div className="absolute top-4 left-4 right-4 z-50 bg-red-500 text-white p-4 rounded-xl shadow-lg text-center">
              {error}
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 z-50 flex justify-center">
            <button
              onClick={runDemo}
              className="bg-accent text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-accent/30 border-2 border-white animate-bounce"
            >
              Skip Camera (Use Demo Items)
            </button>
          </div>

          <CameraCapture
            onCapture={handleCapture}
            onCancel={() => router.push("/team-1")}
          />
        </>
      )}

      {currentState === "scanning" && <LoadingScanner phase={scanPhase} />}

      {currentState === "reviewing" && (
        <IngredientList
          initialIngredients={ingredients}
          onConfirmAll={handleConfirmIngredients}
        />
      )}
    </div>
  );
}
