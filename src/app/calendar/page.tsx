"use client"

import { useState } from "react";
import Calendar from "@/components/Calendar";

interface LogEntry {
  id: string;
  date: string;
  calories?: number;
  weight?: number;
  activity?: string;
}

type LogType = "calorie" | "weight" | "activity";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hasCalorieLog, setHasCalorieLog] = useState(false);
  const [hasWeightLog, setHasWeightLog] = useState(false);
  const [hasActivityLog, setHasActivityLog] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [logType, setLogType] = useState<LogType | null>(null);
  const [logValue, setLogValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleDateSelect = (
    date: Date,
    hasCalorie: boolean,
    hasWeight: boolean
  ) => {
    setSelectedDate(date);
    setHasCalorieLog(hasCalorie);
    setHasWeightLog(hasWeight);
    setShowDayView(true);
    setLogType(null);
    setLogValue("");
    setError("");
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logType || !logValue || !selectedDate) return;
    setIsSubmitting(true);
    setError("");
    try {
      let endpoint = "";
      let body: any = { date: selectedDate.toISOString().split("T")[0] };
      if (logType === "calorie") {
        endpoint = "/api/calorie-log";
        body.calories = parseInt(logValue);
      } else if (logType === "weight") {
        endpoint = "/api/weight-log";
        body.weight = parseFloat(logValue);
      } else if (logType === "activity") {
        endpoint = "/api/activity-log";
        body.activity = logValue;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setLogValue("");
        setLogType(null);
        // Optionally, refresh logs for the day
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to log entry");
      }
    } catch (err) {
      setError("Error logging entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Calendar Log View</h1>
        {!showDayView && (
          <div>
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        )}
        {showDayView && selectedDate && (
          <div>
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setShowDayView(false)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                &larr; Back to calendar
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {formatDate(selectedDate)}
              </h2>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Log:</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setLogType("calorie")}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      logType === "calorie"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">Calories</div>
                      <div className="text-sm text-gray-600">Log calorie intake</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setLogType("weight")}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      logType === "weight"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">Weight</div>
                      <div className="text-sm text-gray-600">Log body weight</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setLogType("activity")}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      logType === "activity"
                        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                        : "border-gray-200 hover:border-yellow-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">Activity</div>
                      <div className="text-sm text-gray-600">Log activity</div>
                    </div>
                  </button>
                </div>
              </div>
              {logType && (
                <form onSubmit={handleLogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {logType === "calorie"
                        ? "Calories"
                        : logType === "weight"
                        ? "Weight (lbs)"
                        : "Activity Description"}
                    </label>
                    {logType === "activity" ? (
                      <input
                        type="text"
                        value={logValue}
                        onChange={(e) => setLogValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Describe your activity (e.g. 30 min walk)"
                        required
                      />
                    ) : (
                      <input
                        type="number"
                        value={logValue}
                        onChange={(e) => setLogValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={logType === "calorie" ? "Enter calories" : "Enter weight"}
                        min={logType === "calorie" ? "1" : "50"}
                        max={logType === "calorie" ? "10000" : "500"}
                        step={logType === "calorie" ? "1" : "0.1"}
                        required
                      />
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Log"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogType(null)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
