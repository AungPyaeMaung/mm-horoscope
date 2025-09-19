// app/components/ResultsDisplay.tsx
import { TimeConversionResult } from "../lib/time-converter";

interface ResultsDisplayProps {
  result: TimeConversionResult | null;
  loading: boolean;
  onCalculate: () => void;
  onStartLagCalculation?: () => void;
}

export default function ResultsDisplay({
  result,
  loading,
  onCalculate,
  onStartLagCalculation,
}: ResultsDisplayProps) {
  const canShowLagCalculation =
    result && result.finalTime && onStartLagCalculation;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Results</h2>

      <div className="text-center mb-4">
        <button
          onClick={onCalculate}
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
              {result.ancientTime.nari} Nari {result.ancientTime.vizana} Vizana{" "}
              {result.ancientTime.khara} Khara
            </p>
          </div>

          {result.sunHourUnit && (
            <div>
              <h3 className="font-semibold mb-2">Sun Hour Unit</h3>
              <p className="text-lg bg-yellow-50 p-2 rounded border border-yellow-200">
                {result.sunHourUnit.nari} Nari {result.sunHourUnit.vizana}{" "}
                Vizana {result.sunHourUnit.khara} Khara{" "}
                {result.sunHourUnit.anukhara} Anukhara
              </p>
            </div>
          )}

          {result.finalTime && (
            <div>
              <h3 className="font-semibold mb-2 text-green-700">
                Final Time (Ancient + Sun Hour)
              </h3>
              <p className="text-xl text-green-700 font-bold bg-green-50 p-3 rounded border border-green-200">
                {result.finalTime.nari} Nari {result.finalTime.vizana} Vizana{" "}
                {result.finalTime.khara} Khara {result.finalTime.anukhara || 0}{" "}
                Anukhara
              </p>
              <p className="text-xs text-green-600 mt-1">
                * Nari overflow handled (subtracted 60 if ≥ 60)
              </p>
            </div>
          )}

          {canShowLagCalculation && (
            <div className="mt-4">
              <button
                onClick={onStartLagCalculation}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                Start Sequential Lag Calculation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
