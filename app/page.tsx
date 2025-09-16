"use client";

import { useState } from "react";
import {
  BirthInfo,
  Location,
  TimeConversionResult,
} from "./lib/time-converter";

export default function Home() {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: 1,
    month: 1,
    year: 1990,
    hour: 12,
    minute: 0,
    second: 0,
    period: "AM",
  });

  const [location, setLocation] = useState<Location>({
    latitude: 16.8409, // Yangon
    longitude: 96.1735,
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
        body: JSON.stringify({ birthInfo, location }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Error calculating time");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Myanmar Vedic Astrology Calculator
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
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
                      date: parseInt(e.target.value),
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
                      month: parseInt(e.target.value),
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
                      year: parseInt(e.target.value),
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
                      hour: parseInt(e.target.value),
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
                      minute: parseInt(e.target.value),
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
                      second: parseInt(e.target.value),
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
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={location.latitude}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    latitude: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 16.8409"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={location.longitude}
                onChange={(e) =>
                  setLocation({
                    ...location,
                    longitude: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 96.1735"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? "Calculating..." : "Calculate Time Conversion"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Time Conversion Results
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Original Birth Time (MMT)</h3>
              <p className="text-lg">{result.originalMMT}</p>

              <h3 className="font-semibold mb-2 mt-4">LMT Offset</h3>
              <p className="text-lg">
                {Math.abs(result.lmtOffset)} minutes{" "}
                {result.lmtOffset >= 0 ? "ahead" : "behind"} MMT
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Machine Time (LMT)</h3>
              <p className="text-lg">
                {result.machineTime.hours}:
                {result.machineTime.minutes.toString().padStart(2, "0")}:
                {result.machineTime.seconds.toString().padStart(2, "0")}
              </p>

              <h3 className="font-semibold mb-2 mt-4">Ancient Burmese Time</h3>
              <p className="text-lg text-orange-700 font-medium">
                {result.ancientTime.nari} Nari {result.ancientTime.vizana}{" "}
                Vizana {result.ancientTime.khara} Khara
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
