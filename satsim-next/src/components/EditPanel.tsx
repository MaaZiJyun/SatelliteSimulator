import { useEffect, useState } from "react";
import { useStore } from "@/stores/dataStores";

export default function EditPanel() {
  const {
    selected,
    setSelected,
    data,
    setData,
    setIsFormOpen,
    getIdTypeMapping,
  } = useStore();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    setForm(selected);
  }, [selected]);

  if (!selected || !form) return null;
  const starIdList = getIdTypeMapping("star");
  const planetIdList = getIdTypeMapping("planet");
  const type = selected.type;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedChange = (key: string, subKey: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: value,
      },
    }));
  };

  const handleDeepNestedChange = (
    key: string,
    subKey: string,
    deepKey: string,
    value: any
  ) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: {
          ...prev[key][subKey],
          [deepKey]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    if (!data) return;

    let type: keyof typeof data | null = null;
    for (const key of Object.keys(data)) {
      const list = (data as any)[key];
      if (
        Array.isArray(list) &&
        list.some((item: any) => item.id === selected.id)
      ) {
        type = key as keyof typeof data;
        break;
      }
    }

    if (!type) return;

    const updatedList = data[type].map((item: any) =>
      item.id === selected.id ? form : item
    );

    setData({
      ...data,
      [type]: updatedList,
    });

    setIsFormOpen(false);
    setSelected(null);
  };

  const renderField = (key: string, value: any) => {
    // Handle simple fields (string, number)
    if (key === "id") {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          {(value ?? "null").toUpperCase()}
          {/* <input
            className="w-full px-2 py-1 border rounded cursor-not-allowed"
            type="text"
            value={value ?? "null"}
            disabled
          /> */}
        </div>
      );
    }

    if (key === "type") {
      const options = [
        "star",
        "planet",
        "natural-satellite",
        "artificial-satellite",
      ];
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <select
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
            value={value ?? "None"}
            onChange={(e) =>
              handleChange(
                key,
                typeof value === "number" ? +e.target.value : e.target.value
              )
            }
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (key === "primary") {
      var options: string[];
      if (type === "planet") {
        options = starIdList;
      } else if (
        type === "natural-satellite" ||
        type === "artificial-satellite"
      ) {
        options = planetIdList;
      } else {
        options = [];
      }
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <select
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
            value={value ?? "None"}
            onChange={(e) =>
              handleChange(
                key,
                typeof value === "number" ? +e.target.value : e.target.value
              )
            }
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (typeof value === "string" || typeof value === "number") {
      return (
        <div className="mb-3" key={key}>
          <label className="block text-sm font-medium mb-1 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <input
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
            type={typeof value === "number" ? "number" : "text"}
            value={value}
            onChange={(e) =>
              handleChange(
                key,
                typeof value === "number" ? +e.target.value : e.target.value
              )
            }
          />
        </div>
      );
    }

    // Handle state object with position and velocity
    if (
      key === "state" &&
      typeof value === "object" &&
      value.position &&
      value.velocity
    ) {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-base font-semibold mb-2">State</h3>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div className="mb-2" key={subKey}>
              <h4 className="text-sm font-medium mb-1 capitalize">
                {subKey.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <div className="flex space-x-2">
                {["x", "y", "z"].map((axis, index) => (
                  <div key={axis} className="flex-1">
                    <label className="block text-sm mb-1 capitalize">
                      {axis}
                    </label>
                    <input
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                      type="number"
                      value={(subValue as number[])[index]}
                      onChange={(e) => {
                        const newValue = [...(subValue as number[])];
                        newValue[index] = +e.target.value;
                        handleNestedChange(key, subKey, newValue);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle physical object
    if (key === "physical" && typeof value === "object") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-base font-semibold mb-2">Physical</h3>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div className="mb-2" key={subKey}>
              <label className="block text-sm mb-1 capitalize">
                {subKey.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                type="number"
                value={subValue as number}
                onChange={(e) =>
                  handleNestedChange(key, subKey, +e.target.value)
                }
              />
            </div>
          ))}
        </div>
      );
    }

    // Handle rotation object
    if (key === "rotation" && typeof value === "object") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-base font-semibold mb-2">Rotation</h3>
          {Object.entries(value).map(([subKey, subValue]) => {
            if (subKey === "progradeDirection") {
              return (
                <div className="mb-2" key={subKey}>
                  <label className="block text-sm mb-1 capitalize">
                    {subKey.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="checkbox"
                    checked={subValue as boolean}
                    onChange={(e) =>
                      handleNestedChange(key, subKey, e.target.checked)
                    }
                    className="h-4 w-4 text-[#00ffff] focus:ring-[#00ffff] border-gray-300 rounded"
                  />
                </div>
              );
            }
            return (
              <div className="mb-2" key={subKey}>
                <label className="block text-sm mb-1 capitalize">
                  {subKey.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                  type="number"
                  value={subValue as number}
                  onChange={(e) =>
                    handleNestedChange(key, subKey, +e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Handle orbit object
    if (key === "orbit" && typeof value === "object") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-base font-semibold mb-2">Orbit</h3>
          {Object.entries(value).map(([subKey, subValue]) => (
            <div className="mb-2" key={subKey}>
              <label className="block text-sm mb-1 capitalize">
                {subKey.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                type={typeof subValue === "number" ? "number" : "text"}
                value={
                  subValue as string | number | readonly string[] | undefined
                }
                onChange={(e) =>
                  handleNestedChange(
                    key,
                    subKey,
                    typeof subValue === "number"
                      ? +e.target.value
                      : e.target.value
                  )
                }
              />
            </div>
          ))}
        </div>
      );
    }

    // Handle visual object
    if (key === "visual" && typeof value === "object") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-base font-semibold mb-2">Visual</h3>
          {Object.entries(value).map(([subKey, subValue]) => {
            if (subKey === "emissive" || subKey === "wireframe") {
              return (
                <div className="mb-2" key={subKey}>
                  <label className="block text-sm mb-1 capitalize">
                    {subKey}
                  </label>
                  <input
                    type="checkbox"
                    checked={subValue as boolean}
                    onChange={(e) =>
                      handleNestedChange(key, subKey, e.target.checked)
                    }
                    className="h-4 w-4 text-[#00ffff] focus:ring-[#00ffff] border-gray-300 rounded"
                  />
                </div>
              );
            }
            return (
              <div className="mb-2" key={subKey}>
                <label className="block text-sm mb-1 capitalize">
                  {subKey}
                </label>
                <input
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                  type={subKey === "color" ? "color" : "text"}
                  value={subValue as string}
                  onChange={(e) =>
                    handleNestedChange(key, subKey, e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Handle groundStations array
    if (Array.isArray(value) && key === "groundStations") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-sm font-semibold mb-2">Ground Stations</h3>
          {value.map((station: any, index: number) => (
            <div key={station.id} className="border p-2 rounded mb-2">
              <input
                className="w-full mb-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                placeholder="Name"
                value={station.name}
                onChange={(e) => {
                  const updated = [...form.groundStations];
                  updated[index] = { ...updated[index], name: e.target.value };
                  handleChange("groundStations", updated);
                }}
              />
              <div className="flex space-x-2">
                {["lat", "lon", "alt"].map((field) => (
                  <input
                    key={field}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    type="number"
                    value={station[field]}
                    onChange={(e) => {
                      const updated = [...form.groundStations];
                      updated[index] = {
                        ...updated[index],
                        [field]: +e.target.value,
                      };
                      handleChange("groundStations", updated);
                    }}
                  />
                ))}
              </div>
              <button
                className="text-sm text-red-500 hover:underline mt-1"
                onClick={() => {
                  const updated = [...form.groundStations];
                  updated.splice(index, 1);
                  handleChange("groundStations", updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="text-sm text-[#00ffff] hover:underline"
            onClick={() => {
              handleChange("groundStations", [
                ...form.groundStations,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  name: "",
                  lat: 0,
                  lon: 0,
                  alt: 0,
                },
              ]);
            }}
          >
            Add Ground Station
          </button>
        </div>
      );
    }

    // Handle observationPoints array
    if (Array.isArray(value) && key === "observationPoints") {
      return (
        <div className="mb-4" key={key}>
          <h3 className="text-sm font-semibold mb-2">Observation Points</h3>
          {value.map((point: any, index: number) => (
            <div key={point.id} className="border p-2 rounded mb-2">
              <input
                className="w-full mb-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                placeholder="Name"
                value={point.name}
                onChange={(e) => {
                  const updated = [...form.observationPoints];
                  updated[index] = { ...updated[index], name: e.target.value };
                  handleChange("observationPoints", updated);
                }}
              />
              <div className="flex space-x-2">
                {["lat", "lon", "alt"].map((field) => (
                  <input
                    key={field}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#00ffff] focus:border-[#00ffff]"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    type="number"
                    value={point[field]}
                    onChange={(e) => {
                      const updated = [...form.observationPoints];
                      updated[index] = {
                        ...updated[index],
                        [field]: +e.target.value,
                      };
                      handleChange("observationPoints", updated);
                    }}
                  />
                ))}
              </div>
              <button
                className="text-sm text-red-500 hover:underline mt-1"
                onClick={() => {
                  const updated = [...form.observationPoints];
                  updated.splice(index, 1);
                  handleChange("observationPoints", updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="text-sm text-[#00ffff] hover:underline"
            onClick={() => {
              handleChange("observationPoints", [
                ...form.observationPoints,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  name: "",
                  lat: 0,
                  lon: 0,
                  alt: 0,
                },
              ]);
            }}
          >
            Add Observation Point
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-1/4 p-4 bg-black border-l border-gray-200 fixed right-0 top-0 bottom-0 z-50 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Edit: {form.name}</h2>

      {Object.entries(form).map(([key, value]) => renderField(key, value))}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            setIsFormOpen(false);
            setSelected(null);
          }}
          className="px-3 py-1 rounded border border-gray-400 hover:text-red-500 hover:border-red-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 rounded border border-gray-400 hover:text-[#00ffff] hover:border-[#00ffff]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
