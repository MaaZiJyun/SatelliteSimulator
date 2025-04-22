import { create } from "zustand";
import { nanoid } from "nanoid";

type Vector3 = [number, number, number];

type InitialState = {
  position: Vector3;
  velocity: Vector3;
};

type Rotation = {
  obliquity: number;
  initialMeridianAngle: number;
  rotationPeriod: number;
};

type Visual = {
  wireframe: boolean | undefined;
  color: string;
  texture?: string;
  emissive?: boolean;
};

type GroundStation = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  alt: number;
};

type ObservationPoint = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  alt: number;
};

type CelestialBodyBase = {
  id: string;
  name: string;
  type: string;
  primary: string | null;
  mass: number;
  radius: number;
  initialState: InitialState;
  rotation: Rotation;
  visual: Visual;
};

type Star = CelestialBodyBase & {
  type: "star";
  primary: null;
};

type Planet = CelestialBodyBase & {
  type: "planet";
  groundStations: GroundStation[];
  observationPoints: ObservationPoint[];
};

type NaturalSatellite = CelestialBodyBase & {
  type: "natural-satellite";
};

type ArtificialSatellite = CelestialBodyBase & {
  type: "artificial-satellite";
};

type Data = {
  stars: Star[];
  planets: Planet[];
  naturalSatellites: NaturalSatellite[];
  artificialSatellites: ArtificialSatellite[];
};

type Store = {
  data: Data;
  selected: any | null;
  isFormOpen: boolean;
  setData: (data: Data) => void;
  setSelected: (item: any) => void;
  setIsFormOpen: (open: boolean) => void;
  isDataEmpty: () => boolean;

  // CRUD operations
  addStar: () => void;
  deleteStar: (starId: string) => void;

  addPlanet: () => void;
  deletePlanet: (planetId: string) => void;

  addGroundStation: (planetId: string) => void;
  deleteGroundStation: (planetId: string, gsId: string) => void;

  addObservationPoint: (planetId: string) => void;
  deleteObservationPoint: (planetId: string, opId: string) => void;

  addNaturalSatellite: () => void;
  deleteNaturalSatellite: (satId: string) => void;

  addArtificialSatellite: () => void;
  deleteArtificialSatellite: (satId: string) => void;

  downloadDataAsJSON: () => void;
};

const defaultInitialState: InitialState = {
  position: [0, 0, 0],
  velocity: [0, 0, 0]
};

const defaultRotation: Rotation = {
  obliquity: 0,
  initialMeridianAngle: 0,
  rotationPeriod: 86400 // 1 day in seconds
};

const defaultVisual: Visual = {
  color: "#ffffff",
  emissive: false,
  wireframe: false,
};

export const useStore = create<Store>((set, get) => ({
  data: {
    stars: [],
    planets: [],
    naturalSatellites: [],
    artificialSatellites: []
  },
  selected: null,
  isFormOpen: false,

  // setData: (data) => set({ data }),
  setData: (data) => {
    const updatedData: Data = {
      stars: data.stars.map(star => ({
        ...star,
        id: star.id || nanoid()
      })),
      planets: data.planets.map(planet => ({
        ...planet,
        id: planet.id || nanoid(),
        groundStations: planet.groundStations.map(gs => ({
          ...gs,
          id: gs.id || nanoid()
        })),
        observationPoints: planet.observationPoints.map(op => ({
          ...op,
          id: op.id || nanoid()
        }))
      })),
      naturalSatellites: data.naturalSatellites.map(sat => ({
        ...sat,
        id: sat.id || nanoid()
      })),
      artificialSatellites: data.artificialSatellites.map(sat => ({
        ...sat,
        id: sat.id || nanoid()
      }))
    };
    set({ data: updatedData });
  },
  setSelected: (item) => set({ selected: item }),
  setIsFormOpen: (open) => set({ isFormOpen: open }),
  isDataEmpty: () => {
    const { data } = get();
    return (
      data.stars.length === 0 &&
      data.planets.length === 0 &&
      data.naturalSatellites.length === 0 &&
      data.artificialSatellites.length === 0
    );
  },

  addStar: () =>
    set((state) => ({
      data: {
        ...state.data,
        stars: [
          ...state.data.stars,
          {
            id: nanoid(),
            type: "star",
            name: "New Star",
            primary: null,
            mass: 1.989e30,
            radius: 696340,
            initialState: defaultInitialState,
            rotation: defaultRotation,
            visual: {
              ...defaultVisual,
              color: "#ffff00",
              emissive: true
            }
          }
        ]
      }
    })),

  deleteStar: (starId) =>
    set((state) => ({
      data: {
        ...state.data,
        stars: state.data.stars.filter((s) => s.id !== starId)
      }
    })),

  addPlanet: () =>
    set((state) => {
      const sun = state.data.stars.find(s => s.type === "star");
      return {
        data: {
          ...state.data,
          planets: [
            ...state.data.planets,
            {
              id: nanoid(),
              type: "planet",
              name: "New Planet",
              primary: sun ? sun.id : null,
              mass: 5.972e24,
              radius: 6371,
              initialState: defaultInitialState,
              rotation: defaultRotation,
              visual: {
                ...defaultVisual,
                color: "#1a73e8"
              },
              groundStations: [],
              observationPoints: []
            }
          ]
        }
      };
    }),

  deletePlanet: (planetId) =>
    set((state) => ({
      data: {
        ...state.data,
        planets: state.data.planets.filter((p) => p.id !== planetId)
      }
    })),

  addGroundStation: (planetId) =>
    set((state) => ({
      data: {
        ...state.data,
        planets: state.data.planets.map((planet) =>
          planet.id === planetId
            ? {
              ...planet,
              groundStations: [
                ...planet.groundStations,
                {
                  id: nanoid(),
                  name: "New Ground Station",
                  lat: 0,
                  lon: 0,
                  alt: 0
                }
              ]
            }
            : planet
        )
      }
    })),

  deleteGroundStation: (planetId, gsId) =>
    set((state) => ({
      data: {
        ...state.data,
        planets: state.data.planets.map((planet) =>
          planet.id === planetId
            ? {
              ...planet,
              groundStations: planet.groundStations.filter(
                (gs) => gs.id !== gsId
              )
            }
            : planet
        )
      }
    })),

  addObservationPoint: (planetId) =>
    set((state) => ({
      data: {
        ...state.data,
        planets: state.data.planets.map((planet) =>
          planet.id === planetId
            ? {
              ...planet,
              observationPoints: [
                ...planet.observationPoints,
                {
                  id: nanoid(),
                  name: "New Observation Point",
                  lat: 0,
                  lon: 0,
                  alt: 0
                }
              ]
            }
            : planet
        )
      }
    })),

  deleteObservationPoint: (planetId, opId) =>
    set((state) => ({
      data: {
        ...state.data,
        planets: state.data.planets.map((planet) =>
          planet.id === planetId
            ? {
              ...planet,
              observationPoints: planet.observationPoints.filter(
                (op) => op.id !== opId
              )
            }
            : planet
        )
      }
    })),

  addNaturalSatellite: () =>
    set((state) => {
      const earth = state.data.planets.find(p => p.name === "Earth");
      return {
        data: {
          ...state.data,
          naturalSatellites: [
            ...state.data.naturalSatellites,
            {
              id: nanoid(),
              type: "natural-satellite",
              name: "New Moon",
              primary: earth ? earth.id : null,
              mass: 7.342e22,
              radius: 1737,
              initialState: defaultInitialState,
              rotation: defaultRotation,
              visual: {
                ...defaultVisual,
                color: "#cccccc"
              }
            }
          ]
        }
      };
    }),

  deleteNaturalSatellite: (satId) =>
    set((state) => ({
      data: {
        ...state.data,
        naturalSatellites: state.data.naturalSatellites.filter(
          (sat) => sat.id !== satId
        )
      }
    })),

  addArtificialSatellite: () =>
    set((state) => {
      const earth = state.data.planets.find(p => p.name === "Earth");
      return {
        data: {
          ...state.data,
          artificialSatellites: [
            ...state.data.artificialSatellites,
            {
              id: nanoid(),
              type: "artificial-satellite",
              name: "New Satellite",
              primary: earth ? earth.id : null,
              mass: 1000,
              radius: 5,
              initialState: defaultInitialState,
              rotation: defaultRotation,
              visual: {
                ...defaultVisual,
                color: "#ffcc00"
              }
            }
          ]
        }
      };
    }),

  deleteArtificialSatellite: (satId) =>
    set((state) => ({
      data: {
        ...state.data,
        artificialSatellites: state.data.artificialSatellites.filter(
          (sat) => sat.id !== satId
        )
      }
    })),

  downloadDataAsJSON: () => {
    const { data } = get();
    const jsonData = {
      stars: data.stars.map(star => ({
        name: star.name,
        type: star.type,
        mass: star.mass,
        radius: star.radius,
        initialState: star.initialState,
        rotation: star.rotation,
        visual: star.visual
      })),
      planets: data.planets.map(planet => ({
        name: planet.name,
        type: planet.type,
        primary: planet.primary,
        mass: planet.mass,
        radius: planet.radius,
        initialState: planet.initialState,
        rotation: planet.rotation,
        visual: planet.visual,
        groundStations: planet.groundStations.map(gs => ({
          name: gs.name,
          lat: gs.lat,
          lon: gs.lon,
          alt: gs.alt
        })),
        observationPoints: planet.observationPoints.map(op => ({
          name: op.name,
          lat: op.lat,
          lon: op.lon,
          alt: op.alt
        }))
      })),
      naturalSatellites: data.naturalSatellites.map(sat => ({
        name: sat.name,
        type: sat.type,
        primary: sat.primary,
        mass: sat.mass,
        radius: sat.radius,
        initialState: sat.initialState,
        rotation: sat.rotation,
        visual: sat.visual
      })),
      artificialSatellites: data.artificialSatellites.map(sat => ({
        name: sat.name,
        type: sat.type,
        primary: sat.primary,
        mass: sat.mass,
        radius: sat.radius,
        initialState: sat.initialState,
        rotation: sat.rotation,
        visual: sat.visual
      }))
    };

    const json = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `celestial-data-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}));