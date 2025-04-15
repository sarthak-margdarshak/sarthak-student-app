import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function TestEvaluation() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Evaluating...");
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {/* Pulsing rings */}
          <div
            className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping"
            style={{ animationDuration: "1.5s", animationDelay: "1s" }}
          ></div>

          {/* Main circle with spinning border */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
            <span className="text-lg font-semibold text-blue-500">50%</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Evaluating Your Test
          </h3>
          <p className="mt-2 text-gray-600">
            Please wait while we analyze your responses...
          </p>
        </div>
      </div>
    </div>
  );
}
