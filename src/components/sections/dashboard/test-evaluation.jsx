import { APPWRITE_API } from "@/config-global";
import { useAppContent } from "@/hook/app/useAppContent";
import { appwriteFunction } from "@/hook/auth/AppwriteContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestEvaluation({ attempt }) {
  const { setCurrentPageName } = useAppContent();
  const [showReEvaluate, setShowReEvaluate] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Dots animation effect
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "....") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    // Update page name based on evaluation state
    setCurrentPageName(showReEvaluate ? "Evaluation Delayed" : "Evaluating...");
  }, [showReEvaluate, setCurrentPageName]);

  useEffect(() => {
    // Get test end time from attempt object
    const testEndTime = attempt?.test_ended || new Date().getTime();

    // Check every minute if 15 minutes have passed
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - new Date(testEndTime).getTime();
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

      if (timeDifference >= fifteenMinutes) {
        setShowReEvaluate(true);
      }
    }, 60000); // Check every minute

    // Initial check
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - new Date(testEndTime).getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    if (timeDifference >= fifteenMinutes) {
      setShowReEvaluate(true);
    }

    return () => clearInterval(interval);
  }, [attempt]);

  const handleReEvaluate = () => {
    try {
      appwriteFunction.createExecution(
        APPWRITE_API.functions.sarthakAPI,
        JSON.stringify({
          attemptId: attempt.$id,
        }),
        true,
        "/mockTest/evaluate"
      );

      toast.success("Re-evaluation started successfully");
    } catch (error) {
      toast.error(error.message);
    }
    setShowReEvaluate(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {!showReEvaluate ? (
            <>
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
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-blue-500 mt-1">
                    {dots}
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Error icon for timeout
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-200"></div>
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {showReEvaluate ? "Evaluation Delayed" : "Evaluating Your Test"}
          </h3>
          <p className="mt-2 text-gray-600">
            {showReEvaluate
              ? "Due to high request volume, the evaluation is taking longer than expected. Please click the re-evaluate button below to try again."
              : "It may take 15 minutes to evaluate your test after the test is submitted. Please wait while we analyze your responses. You may refresh the page to check current status."}
          </p>

          {showReEvaluate && (
            <button
              onClick={handleReEvaluate}
              className="mt-6 w-full max-w-md bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Re-evaluate Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
