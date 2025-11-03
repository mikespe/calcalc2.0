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

  const [existingLogs, setExistingLogs] = useState<{
    calories?: { id: string; calories: number }[];
    weight?: { id: string; weight: number };
    activities?: { id: string; activity: string }[];
  }>({});
  
  const [editingCalorieId, setEditingCalorieId] = useState<string | null>(null);
  const [editingCalorieValue, setEditingCalorieValue] = useState<string>("");

  const handleDateSelect = async (
    date: Date,
    hasCalorie: boolean,
    hasWeight: boolean,
    hasActivity: boolean
  ) => {
    setSelectedDate(date);
    setHasCalorieLog(hasCalorie);
    setHasWeightLog(hasWeight);
    setHasActivityLog(hasActivity);
    setShowDayView(true);
    setLogType(null);
    setLogValue("");
    setError("");
    
    // Fetch existing logs for this date
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/logs`);
      const data = await response.json();
      
      const dateLogs = {
        calories: data.calorieLogs?.filter((log: any) => log.date.startsWith(dateStr))
          .map((log: any) => ({ id: log.id, calories: log.calories })) || [],
        weight: data.weightLogs?.find((log: any) => log.date.startsWith(dateStr)) ? {
          id: data.weightLogs.find((log: any) => log.date.startsWith(dateStr)).id,
          weight: data.weightLogs.find((log: any) => log.date.startsWith(dateStr)).weight
        } : undefined,
        activities: data.activityLogs?.filter((log: any) => log.date.startsWith(dateStr)) || []
      };
      
      setExistingLogs(dateLogs);
    } catch (error) {
      console.error('Error fetching existing logs:', error);
    }
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
        
        // Refresh existing logs for this date
        if (selectedDate) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          const logsResponse = await fetch(`/api/logs`);
          const logsData = await logsResponse.json();
          
          const dateLogs = {
            calories: logsData.calorieLogs?.filter((log: any) => log.date.startsWith(dateStr))
              .map((log: any) => ({ id: log.id, calories: log.calories })) || [],
            weight: logsData.weightLogs?.find((log: any) => log.date.startsWith(dateStr)) ? {
              id: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).id,
              weight: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).weight
            } : undefined,
            activities: logsData.activityLogs?.filter((log: any) => log.date.startsWith(dateStr)) || []
          };
          
          setExistingLogs(dateLogs);
        }
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

  const handleDeleteCalorie = async (calorieId: string) => {
    try {
      const response = await fetch(`/api/calorie-log/${calorieId}`, {
        method: 'DELETE',
      });
      
      if (response.ok && selectedDate) {
        // Refresh existing logs
        const dateStr = selectedDate.toISOString().split('T')[0];
        const logsResponse = await fetch(`/api/logs`);
        const logsData = await logsResponse.json();
        
        const dateLogs = {
          calories: logsData.calorieLogs?.filter((log: any) => log.date.startsWith(dateStr))
            .map((log: any) => ({ id: log.id, calories: log.calories })) || [],
          weight: logsData.weightLogs?.find((log: any) => log.date.startsWith(dateStr)) ? {
            id: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).id,
            weight: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).weight
          } : undefined,
          activities: logsData.activityLogs?.filter((log: any) => log.date.startsWith(dateStr)) || []
        };
        
        setExistingLogs(dateLogs);
      }
    } catch (error) {
      console.error('Error deleting calorie log:', error);
    }
  };

  const handleEditCalorie = (calorieId: string, currentCalories: number) => {
    setEditingCalorieId(calorieId);
    setEditingCalorieValue(currentCalories.toString());
  };

  const handleSaveCalorieEdit = async () => {
    if (!editingCalorieId || !editingCalorieValue) return;
    
    try {
      const response = await fetch(`/api/calorie-log/${editingCalorieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calories: parseInt(editingCalorieValue) }),
      });
      
      if (response.ok && selectedDate) {
        // Refresh existing logs
        const dateStr = selectedDate.toISOString().split('T')[0];
        const logsResponse = await fetch(`/api/logs`);
        const logsData = await logsResponse.json();
        
        const dateLogs = {
          calories: logsData.calorieLogs?.filter((log: any) => log.date.startsWith(dateStr))
            .map((log: any) => ({ id: log.id, calories: log.calories })) || [],
          weight: logsData.weightLogs?.find((log: any) => log.date.startsWith(dateStr)) ? {
            id: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).id,
            weight: logsData.weightLogs.find((log: any) => log.date.startsWith(dateStr)).weight
          } : undefined,
          activities: logsData.activityLogs?.filter((log: any) => log.date.startsWith(dateStr)) || []
        };
        
        setExistingLogs(dateLogs);
        setEditingCalorieId(null);
        setEditingCalorieValue("");
      }
    } catch (error) {
      console.error('Error updating calorie log:', error);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Calendar Log View</h1>
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
              
              {/* Display existing logs */}
              {(() => {
                const hasValidCalories = existingLogs.calories && existingLogs.calories.length > 0 && 
                  existingLogs.calories.some(log => log.calories > 0);
                const hasValidWeight = existingLogs.weight && existingLogs.weight.weight > 0;
                const hasValidActivities = existingLogs.activities && existingLogs.activities.length > 0;
                const hasAnyLogs = hasValidCalories || hasValidWeight || hasValidActivities;
                
                return hasAnyLogs ? (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Logs for This Day:</h3>
                    <div className="space-y-3">
                      {/* Calorie List */}
                      {existingLogs.calories && existingLogs.calories.length > 0 && (() => {
                        const validCalorieLogs = existingLogs.calories.filter(log => log.calories > 0);
                        const totalCalories = validCalorieLogs.reduce((sum, log) => sum + log.calories, 0);
                        return totalCalories > 0 && validCalorieLogs.length > 0 ? (
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="font-medium text-blue-600 text-sm mr-2">Calories:</span>
                            <span className="font-semibold text-blue-700 text-sm">
                              Total: {totalCalories} cal
                            </span>
                          </div>
                        <div className="space-y-1">
                          {validCalorieLogs.map((calorieLog) => (
                            <div key={calorieLog.id} className="flex items-center gap-3 text-sm">
                              {editingCalorieId === calorieLog.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="number"
                                    value={editingCalorieValue}
                                    onChange={(e) => setEditingCalorieValue(e.target.value)}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                    min="1"
                                    max="10000"
                                    aria-label="Edit calories"
                                    placeholder="Enter calories"
                                  />
                                  <button
                                    onClick={handleSaveCalorieEdit}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCalorieId(null);
                                      setEditingCalorieValue("");
                                    }}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-gray-700">{calorieLog.calories} cal</span>
                                  <button
                                    onClick={() => handleEditCalorie(calorieLog.id, calorieLog.calories)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCalorie(calorieLog.id)}
                                    className="text-red-600 hover:text-red-700 text-sm w-5 h-5 flex items-center justify-center"
                                    aria-label="Delete"
                                  >
                                    ×
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      ) : null;
                    })()}
                    
                    {/* Weight */}
                    {existingLogs.weight && existingLogs.weight.weight > 0 && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-green-600 mr-2">Weight:</span>
                        <span>{existingLogs.weight.weight} lbs</span>
                      </div>
                    )}
                    
                    {/* Activities */}
                    {existingLogs.activities && existingLogs.activities.length > 0 && (
                      <div>
                        <span className="font-medium text-yellow-600 mr-2 text-sm">Activities:</span>
                        <ul className="list-disc list-inside mt-1">
                          {existingLogs.activities.map((activity) => (
                            <li key={activity.id} className="text-sm text-gray-700">
                              {activity.activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                ) : null;
              })()}
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Log:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
