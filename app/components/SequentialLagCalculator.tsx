// app/components/SequentialLagCalculator.tsx (Complete)
"use client";

import { useState } from "react";
import { AncientBurmeseTime } from "../lib/types";
import {
  AstronomicalPosition,
  LagStageResult,
  AyanaAmsa,
} from "../lib/lagTypes";
import { LagUtils } from "../lib/lagUtils";

interface SequentialLagCalculatorProps {
  finalTime: AncientBurmeseTime;
  onCalculationComplete?: (result: any) => void;
}

export default function SequentialLagCalculator({
  finalTime,
  onCalculationComplete,
}: SequentialLagCalculatorProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [currentTime, setCurrentTime] = useState<
    AncientBurmeseTime & { anuvikhara?: number }
  >({
    ...finalTime,
    anuvikhara: 0,
  });
  const [stageResults, setStageResults] = useState<LagStageResult[]>([]);
  const [completed, setCompleted] = useState(false);

  // Stage input data with example values
  const [stageData, setStageData] = useState({
    stage1: { rasi: 1, nari: 3, vizana: 50 },
    stage2: { amsa: 11, nari: 1, vizana: 35, khara: 42 },
    stage3: { litta: 18, vizana: 2, khara: 41, anukhara: 24 },
    stage4: { vilitta: 17, khara: 2, anukhara: 32, anuvikhara: 26 },
    stage5: { anulitta: 23, anukhara: 3, anuvikhara: 26 },
  });

  // Ayana Amsa
  const [ayanaAmsa, setAyanaAmsa] = useState<AyanaAmsa>({
    amsa: 23,
    litta: 45,
  });
  const [useAyanaAmsa, setUseAyanaAmsa] = useState(true);

  const calculateCurrentStage = () => {
    let subtractTime: AncientBurmeseTime & { anuvikhara?: number };
    let stageValue: number;

    switch (currentStage) {
      case 1:
        subtractTime = {
          nari: stageData.stage1.nari,
          vizana: stageData.stage1.vizana,
          khara: 0,
          anukhara: 0,
          anuvikhara: 0,
        };
        stageValue = stageData.stage1.rasi;
        break;
      case 2:
        subtractTime = {
          nari: stageData.stage2.nari,
          vizana: stageData.stage2.vizana,
          khara: stageData.stage2.khara,
          anukhara: 0,
          anuvikhara: 0,
        };
        stageValue = stageData.stage2.amsa;
        break;
      case 3:
        subtractTime = {
          nari: 0,
          vizana: stageData.stage3.vizana,
          khara: stageData.stage3.khara,
          anukhara: stageData.stage3.anukhara,
          anuvikhara: 0,
        };
        stageValue = stageData.stage3.litta;
        break;
      case 4:
        subtractTime = {
          nari: 0,
          vizana: 0,
          khara: stageData.stage4.khara,
          anukhara: stageData.stage4.anukhara,
          anuvikhara: stageData.stage4.anuvikhara,
        };
        stageValue = stageData.stage4.vilitta;
        break;
      case 5:
        subtractTime = {
          nari: 0,
          vizana: 0,
          khara: 0,
          anukhara: stageData.stage5.anukhara,
          anuvikhara: stageData.stage5.anuvikhara,
        };
        stageValue = stageData.stage5.anulitta;
        break;
      default:
        return;
    }

    const stageResult = LagUtils.calculateLagStage(
      currentTime,
      currentStage,
      stageValue,
      subtractTime
    );
    const newResults = [...stageResults, stageResult];
    setStageResults(newResults);
    setCurrentTime(stageResult.resultTime);

    if (currentStage < 5) {
      setCurrentStage(currentStage + 1);
    } else {
      // Calculate final Asuddha Lag and Suddha Lag
      completeCalculation(newResults);
    }
  };

  const completeCalculation = (results: LagStageResult[]) => {
    const asuddhaLag: AstronomicalPosition = {
      rasi: stageData.stage1.rasi,
      amsa: stageData.stage2.amsa,
      litta: stageData.stage3.litta,
      vilitta: stageData.stage4.vilitta,
      anulitta: stageData.stage5.anulitta,
    };

    const suddhaLag = useAyanaAmsa
      ? LagUtils.subtractAyanaAmsa(asuddhaLag, ayanaAmsa)
      : undefined;

    setCompleted(true);

    if (onCalculationComplete) {
      onCalculationComplete({
        stages: results,
        asuddhaLag,
        ayanaAmsa: useAyanaAmsa ? ayanaAmsa : undefined,
        suddhaLag,
      });
    }
  };

  const resetCalculation = () => {
    setCurrentStage(1);
    setCurrentTime({ ...finalTime, anuvikhara: 0 });
    setStageResults([]);
    setCompleted(false);
  };

  const renderStageInput = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="p-4 bg-purple-50 rounded border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3">
              Stage 1: Rasi
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Rasi</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={stageData.stage1.rasi}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage1: {
                        ...stageData.stage1,
                        rasi: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Nari to subtract
                </label>
                <input
                  type="number"
                  value={stageData.stage1.nari}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage1: {
                        ...stageData.stage1,
                        nari: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Vizana to subtract
                </label>
                <input
                  type="number"
                  value={stageData.stage1.vizana}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage1: {
                        ...stageData.stage1,
                        vizana: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Stage 2: Amsa</h4>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Amsa</label>
                <input
                  type="number"
                  value={stageData.stage2.amsa}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage2: {
                        ...stageData.stage2,
                        amsa: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Nari</label>
                <input
                  type="number"
                  value={stageData.stage2.nari}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage2: {
                        ...stageData.stage2,
                        nari: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Vizana</label>
                <input
                  type="number"
                  value={stageData.stage2.vizana}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage2: {
                        ...stageData.stage2,
                        vizana: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Khara</label>
                <input
                  type="number"
                  value={stageData.stage2.khara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage2: {
                        ...stageData.stage2,
                        khara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4 bg-green-50 rounded border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">
              Stage 3: Litta
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Litta</label>
                <input
                  type="number"
                  value={stageData.stage3.litta}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage3: {
                        ...stageData.stage3,
                        litta: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Vizana</label>
                <input
                  type="number"
                  value={stageData.stage3.vizana}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage3: {
                        ...stageData.stage3,
                        vizana: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Khara</label>
                <input
                  type="number"
                  value={stageData.stage3.khara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage3: {
                        ...stageData.stage3,
                        khara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anukhara
                </label>
                <input
                  type="number"
                  value={stageData.stage3.anukhara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage3: {
                        ...stageData.stage3,
                        anukhara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">
              Stage 4: Vilitta
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Vilitta
                </label>
                <input
                  type="number"
                  value={stageData.stage4.vilitta}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage4: {
                        ...stageData.stage4,
                        vilitta: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Khara</label>
                <input
                  type="number"
                  value={stageData.stage4.khara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage4: {
                        ...stageData.stage4,
                        khara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anukhara
                </label>
                <input
                  type="number"
                  value={stageData.stage4.anukhara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage4: {
                        ...stageData.stage4,
                        anukhara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anuvikhara
                </label>
                <input
                  type="number"
                  value={stageData.stage4.anuvikhara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage4: {
                        ...stageData.stage4,
                        anuvikhara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="p-4 bg-red-50 rounded border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3">
              Stage 5: Anulitta
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anulitta
                </label>
                <input
                  type="number"
                  value={stageData.stage5.anulitta}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage5: {
                        ...stageData.stage5,
                        anulitta: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anukhara
                </label>
                <input
                  type="number"
                  value={stageData.stage5.anukhara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage5: {
                        ...stageData.stage5,
                        anukhara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Anuvikhara
                </label>
                <input
                  type="number"
                  value={stageData.stage5.anuvikhara}
                  onChange={(e) =>
                    setStageData({
                      ...stageData,
                      stage5: {
                        ...stageData.stage5,
                        anuvikhara: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-purple-700">
          Sequential Lag Calculation
        </h2>
        <button
          onClick={resetCalculation}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Current Stage Input */}
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Starting: {LagUtils.formatTime(finalTime)}
            </h3>
            <h4 className="text-md font-medium text-blue-700">
              Current: {LagUtils.formatTime(currentTime)}
            </h4>
          </div>

          {!completed && renderStageInput()}

          {!completed && (
            <div className="mt-4">
              <button
                onClick={calculateCurrentStage}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-semibold"
              >
                {currentStage < 5
                  ? `Calculate Stage ${currentStage} & Next`
                  : "Complete Lag Calculation"}
              </button>
            </div>
          )}

          {/* Ayana Amsa Section */}
          {currentStage >= 5 && !completed && (
            <div className="mt-6 p-4 bg-indigo-50 rounded border border-indigo-200">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={useAyanaAmsa}
                  onChange={(e) => setUseAyanaAmsa(e.target.checked)}
                  className="mr-2"
                />
                <h4 className="font-semibold text-indigo-800">
                  Calculate Suddha Lag
                </h4>
              </div>

              {useAyanaAmsa && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Ayana Amsa
                    </label>
                    <input
                      type="number"
                      value={ayanaAmsa.amsa}
                      onChange={(e) =>
                        setAyanaAmsa({
                          ...ayanaAmsa,
                          amsa: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Ayana Litta
                    </label>
                    <input
                      type="number"
                      value={ayanaAmsa.litta}
                      onChange={(e) =>
                        setAyanaAmsa({
                          ...ayanaAmsa,
                          litta: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stage Results</h3>

          <div className="space-y-3">
            {stageResults.map((stageResult, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Stage {stageResult.stage} ({stageResult.stageName})
                  </span>
                  <span className="text-sm text-green-600">✓ Complete</span>
                </div>
                <p className="text-lg font-mono mt-1">
                  {LagUtils.formatTime(stageResult.resultTime)}
                </p>
              </div>
            ))}

            {/* Show current stage */}
            {!completed && currentStage <= 5 && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">
                    Stage {currentStage} (
                    {
                      ["", "Rasi", "Amsa", "Litta", "Vilitta", "Anulitta"][
                        currentStage
                      ]
                    }
                    )
                  </span>
                  <span className="text-sm text-blue-600">⏳ Current</span>
                </div>
                <p className="text-lg font-mono mt-1">
                  {LagUtils.formatTime(currentTime)}
                </p>
              </div>
            )}
          </div>

          {/* Final Results */}
          {completed && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-purple-100 rounded border border-purple-300">
                <h4 className="font-bold text-purple-800 mb-2">
                  Asuddha Lag (Uncorrected Ascendant):
                </h4>
                <p className="text-lg font-bold text-purple-900">
                  {LagUtils.formatAstronomicalPosition({
                    rasi: stageData.stage1.rasi,
                    amsa: stageData.stage2.amsa,
                    litta: stageData.stage3.litta,
                    vilitta: stageData.stage4.vilitta,
                    anulitta: stageData.stage5.anulitta,
                  })}
                </p>
              </div>

              {useAyanaAmsa && (
                <div className="p-4 bg-indigo-100 rounded border border-indigo-300">
                  <h4 className="font-bold text-indigo-800 mb-2">
                    Suddha Lag (Corrected Ascendant):
                  </h4>
                  <p className="text-lg font-bold text-indigo-900">
                    {LagUtils.formatAstronomicalPosition(
                      LagUtils.subtractAyanaAmsa(
                        {
                          rasi: stageData.stage1.rasi,
                          amsa: stageData.stage2.amsa,
                          litta: stageData.stage3.litta,
                          vilitta: stageData.stage4.vilitta,
                          anulitta: stageData.stage5.anulitta,
                        },
                        ayanaAmsa
                      )
                    )}
                  </p>
                  <p className="text-sm text-indigo-700 mt-1">
                    (After subtracting Ayana Amsa: {ayanaAmsa.amsa} Amsa{" "}
                    {ayanaAmsa.litta} Litta)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{stageResults.length}/5 stages complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stageResults.length / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Instructions */}
          {!completed && (
            <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Instructions:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  • Enter the{" "}
                  {
                    ["", "Rasi", "Amsa", "Litta", "Vilitta", "Anulitta"][
                      currentStage
                    ]
                  }{" "}
                  value and time to subtract
                </li>
                <li>• Click "Calculate Stage {currentStage}" to proceed</li>
                <li>• Each stage uses the result from the previous stage</li>
                <li>• Sequential calculation ensures mathematical accuracy</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
