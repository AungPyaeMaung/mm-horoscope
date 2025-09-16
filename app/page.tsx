"use client";

import { useState } from "react";
import {
  BirthInfo,
  CoordinateInput,
  TimeConversionResult,
} from "./lib/time-converter";

export default function Home() {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: 1,
    month: 3,
    year: 1996,
    hour: 9,
    minute: 30,
    second: 0,
    period: "AM",
  });

  const [coordInput, setCoordInput] = useState<CoordinateInput>({
    type: "dms",
    latitude: {
      degrees: 21,
      minutes: 59,
      direction: "N",
    },
    longitude: {
      degrees: 96,
      minutes: 6,
      direction: "E",
    },
  });

  const [result, setResult] = useState<TimeConversionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/calculate-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ birthInfo, coordInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Error calculating time");
        alert("Error calculating time. Please check your inputs.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Myanmar Vedic Astrology Calculator
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Birth Information Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Birth Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={birthInfo.date}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      date: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={birthInfo.month}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      month: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={birthInfo.year}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      year: parseInt(e.target.value) || 1990,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Hour</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={birthInfo.hour}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      hour: parseInt(e.target.value) || 12,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Minute</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={birthInfo.minute}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      minute: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Second</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={birthInfo.second || 0}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      second: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  value={birthInfo.period}
                  onChange={(e) =>
                    setBirthInfo({
                      ...birthInfo,
                      period: e.target.value as "AM" | "PM",
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Location</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Coordinate Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="decimal"
                    checked={coordInput.type === "decimal"}
                    onChange={(e) =>
                      setCoordInput({
                        ...coordInput,
                        type: e.target.value as "decimal" | "dms",
                      })
                    }
                    className="mr-2"
                  />
                  Decimal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="dms"
                    checked={coordInput.type === "dms"}
                    onChange={(e) =>
                      setCoordInput({
                        ...coordInput,
                        type: e.target.value as "decimal" | "dms",
                      })
                    }
                    className="mr-2"
                  />
                  Degrees & Minutes
                </label>
              </div>
            </div>

            {coordInput.type === "decimal" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Latitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={coordInput.latitude.decimal || ""}
                    onChange={(e) =>
                      setCoordInput({
                        ...coordInput,
                        latitude: {
                          ...coordInput.latitude,
                          decimal: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 21.9833"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Longitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={coordInput.longitude.decimal || ""}
                    onChange={(e) =>
                      setCoordInput({
                        ...coordInput,
                        longitude: {
                          ...coordInput.longitude,
                          decimal: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 96.1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Latitude
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={coordInput.latitude.degrees || ""}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          latitude: {
                            ...coordInput.latitude,
                            degrees: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deg"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={coordInput.latitude.minutes || ""}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          latitude: {
                            ...coordInput.latitude,
                            minutes: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <select
                      value={coordInput.latitude.direction || "N"}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          latitude: {
                            ...coordInput.latitude,
                            direction: e.target.value as "N" | "S",
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="N">N</option>
                      <option value="S">S</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Longitude
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={coordInput.longitude.degrees || ""}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          longitude: {
                            ...coordInput.longitude,
                            degrees: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deg"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={coordInput.longitude.minutes || ""}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          longitude: {
                            ...coordInput.longitude,
                            minutes: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Min"
                    />
                    <select
                      value={coordInput.longitude.direction || "E"}
                      onChange={(e) =>
                        setCoordInput({
                          ...coordInput,
                          longitude: {
                            ...coordInput.longitude,
                            direction: e.target.value as "E" | "W",
                          },
                        })
                      }
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="E">E</option>
                      <option value="W">W</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          <div className="text-center mb-4">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold w-full"
            >
              {loading ? "Calculating..." : "Calculate Time Conversion"}
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Original Time (MMT)</h3>
                <p className="text-lg bg-gray-50 p-2 rounded">
                  {result.originalMMT}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">LMT Offset</h3>
                <p className="text-lg bg-gray-50 p-2 rounded">
                  {result.lmtOffset.hours}h {result.lmtOffset.minutes}m{" "}
                  {result.lmtOffset.seconds}s {result.lmtOffset.direction}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Machine Time (LMT)</h3>
                <p className="text-lg bg-gray-50 p-2 rounded">
                  {result.machineTime.hours.toString().padStart(2, "0")}:
                  {result.machineTime.minutes.toString().padStart(2, "0")}:
                  {result.machineTime.seconds.toString().padStart(2, "0")}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Ancient Burmese Time</h3>
                <p className="text-lg text-orange-700 font-medium bg-orange-50 p-2 rounded">
                  {result.ancientTime.nari} Nari {result.ancientTime.vizana}{" "}
                  Vizana {result.ancientTime.khara} Khara
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
