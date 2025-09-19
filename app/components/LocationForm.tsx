// app/components/LocationForm.tsx
import { CoordinateInput } from "../lib/time-converter";

interface LocationFormProps {
  coordInput: CoordinateInput;
  setCoordInput: (coordInput: CoordinateInput) => void;
}

export default function LocationForm({
  coordInput,
  setCoordInput,
}: LocationFormProps) {
  return (
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
              <label className="block text-sm font-medium mb-1">Latitude</label>
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
  );
}
