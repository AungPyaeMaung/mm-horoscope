// app/components/SunHourForm.tsx
import { SunHourUnit } from "../lib/time-converter";

interface SunHourFormProps {
  sunHourUnit: SunHourUnit;
  setSunHourUnit: (sunHourUnit: SunHourUnit) => void;
  useSunHour: boolean;
  setUseSunHour: (use: boolean) => void;
}

export default function SunHourForm({
  sunHourUnit,
  setSunHourUnit,
  useSunHour,
  setUseSunHour,
}: SunHourFormProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Sun Hour Unit</h2>

      <div className="space-y-4">
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={useSunHour}
              onChange={(e) => setUseSunHour(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium">Add Sun Hour Unit</span>
          </label>
        </div>

        {useSunHour && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Nari</label>
              <input
                type="number"
                min="0"
                max="59"
                value={sunHourUnit.nari}
                onChange={(e) =>
                  setSunHourUnit({
                    ...sunHourUnit,
                    nari: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Vizana</label>
              <input
                type="number"
                min="0"
                max="59"
                value={sunHourUnit.vizana}
                onChange={(e) =>
                  setSunHourUnit({
                    ...sunHourUnit,
                    vizana: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Khara</label>
              <input
                type="number"
                min="0"
                max="59"
                value={sunHourUnit.khara}
                onChange={(e) =>
                  setSunHourUnit({
                    ...sunHourUnit,
                    khara: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Anukhara</label>
              <input
                type="number"
                min="0"
                max="59"
                value={sunHourUnit.anukhara}
                onChange={(e) =>
                  setSunHourUnit({
                    ...sunHourUnit,
                    anukhara: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {!useSunHour && (
          <div className="text-center text-gray-500 py-8">
            <p>Check the box above to add Sun Hour Unit calculations</p>
          </div>
        )}
      </div>
    </div>
  );
}
