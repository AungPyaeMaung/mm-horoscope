// app/components/BirthInfoForm.tsx
import { BirthInfo } from "../lib/time-converter";

interface BirthInfoFormProps {
  birthInfo: BirthInfo;
  setBirthInfo: (birthInfo: BirthInfo) => void;
}

export default function BirthInfoForm({
  birthInfo,
  setBirthInfo,
}: BirthInfoFormProps) {
  return (
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
  );
}
