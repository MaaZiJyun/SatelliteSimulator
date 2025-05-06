import { create } from "zustand";
import { nanoid } from "nanoid";

type Vector3 = [number, number, number];


type Physical = {
  mass: number;
  radius: number;
};

type State = {
  position: Vector3;
  velocity: Vector3;
};

type Rotation = {
  period: number; // JSON中是 period，不是 rotationPeriod
  obliquity: number;
  initialMeridianAngle: number;
  progradeDirection: boolean;
  currentAngle: number;
};

type Visual = {
  color: string;
  texture?: string;
  emissive?: boolean;
  wireframe: boolean;
};

type Orbit = {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  meanAnomalyAtEpoch: number;
  epoch: string;
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

type BaseBody = {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'natural-satellite' | 'artificial-satellite';
  physical: Physical;
  state: State;
  rotation: Rotation;
  visual: Visual;
};

type Star = BaseBody & {
  type: 'star';
  primary: string | null;
  orbit: Orbit;
};

type Planet = BaseBody & {
  type: 'planet';
  primary: string;
  orbit: Orbit;
  groundStations: GroundStation[];
  observationPoints: ObservationPoint[];
};

type NaturalSatellite = BaseBody & {
  type: 'natural-satellite';
  primary: string;
  orbit: Orbit;
};

type ArtificialSatellite = BaseBody & {
  type: 'artificial-satellite';
  primary: string;
  orbit: Orbit;
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

  getXZY: (pos: Vector3) => Vector3;

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
  update: (result: { [id: string]: { position: [number, number, number]; rotation: number } }) => void;

  getIdTypeMapping: (type: 'star' | 'planet' | 'natural-satellite' | 'artificial-satellite') => string[];
};

const defaultVisual: Visual = {
  color: '#aaaaaa',
  texture: '',
  emissive: true,
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

  getXZY: (pos) => {
    const x = pos[0];
    const y = pos[1];
    const z = pos[2];
    return [x, z, y] as Vector3;
  },

  setData: (incomingData) => {
    const ensureId = <T extends { id?: string }>(item: T): T => ({
      ...item,
      id: item.id || nanoid(),
    });

    const updatedData: Data = {
      stars: incomingData.stars.map(ensureId),
      planets: incomingData.planets.map((planet) => ({
        ...ensureId(planet),
        groundStations: planet.groundStations.map(ensureId),
        observationPoints: planet.observationPoints.map(ensureId),
      })),
      naturalSatellites: incomingData.naturalSatellites.map(ensureId),
      artificialSatellites: incomingData.artificialSatellites.map(ensureId),
    };

    set({ data: updatedData });
    return updatedData;
  },

  setSelected: (item) => set({ selected: item }),
  setIsFormOpen: (open) => set({ isFormOpen: open }),
  // Check if data is empty
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
            name: 'Untitled Star',
            type: 'star',
            primary: null, // Example primary value
            orbit: {
              semiMajorAxis: 1e11,
              eccentricity: 0.1,
              inclination: 0,
              longitudeOfAscendingNode: 0,
              argumentOfPeriapsis: 0,
              meanAnomalyAtEpoch: 0,
              epoch: new Date().toISOString(),
            },
            physical: { mass: 1e30, radius: 100000 },
            state: { position: [0, 0, 0], velocity: [0, 0, 0] },
            rotation: {
              period: 1000000,
              obliquity: 0,
              initialMeridianAngle: 0,
              progradeDirection: true,
              currentAngle: 0.0,
            },
            visual: defaultVisual,
          },
        ],
      },
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
      const primary = state.data.stars[0]?.id ?? 'sun';
      return {
        data: {
          ...state.data,
          planets: [
            ...state.data.planets,
            {
              id: nanoid(),
              name: 'Untitled Planet',
              type: 'planet',
              primary,
              physical: { mass: 1e24, radius: 6000 },
              state: { position: [0, 0, 0], velocity: [0, 0, 0] },
              rotation: {
                period: 86400,
                obliquity: 0,
                initialMeridianAngle: 0,
                progradeDirection: true,
                currentAngle: 0.0,
              },
              orbit: {
                semiMajorAxis: 1e8,
                eccentricity: 0,
                inclination: 0,
                longitudeOfAscendingNode: 0,
                argumentOfPeriapsis: 0,
                meanAnomalyAtEpoch: 0,
                epoch: new Date().toISOString(),
              },
              visual: defaultVisual,
              groundStations: [],
              observationPoints: [],
            },
          ],
        },
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
      const primary = state.data.planets[0]?.id ?? 'earth';
      return {
        data: {
          ...state.data,
          naturalSatellites: [
            ...state.data.naturalSatellites,
            {
              id: nanoid(),
              name: 'Untitled Moon',
              type: 'natural-satellite',
              primary,
              physical: { mass: 1e22, radius: 1700 },
              state: { position: [0, 0, 0], velocity: [0, 0, 0] },
              rotation: {
                period: 1000000,
                obliquity: 0,
                initialMeridianAngle: 0,
                progradeDirection: true,
                currentAngle: 0.0,
              },
              orbit: {
                semiMajorAxis: 400000,
                eccentricity: 0,
                inclination: 0,
                longitudeOfAscendingNode: 0,
                argumentOfPeriapsis: 0,
                meanAnomalyAtEpoch: 0,
                epoch: new Date().toISOString(),
              },
              visual: defaultVisual,
            },
          ],
        },
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
      const primary = state.data.planets[0]?.id ?? 'earth';
      return {
        data: {
          ...state.data,
          artificialSatellites: [
            ...state.data.artificialSatellites,
            {
              id: nanoid(),
              name: 'Untitled Satellite',
              type: 'artificial-satellite',
              primary,
              physical: { mass: 1000, radius: 1 },
              state: { position: [0, 0, 0], velocity: [0, 0, 0] },
              rotation: {
                period: 5400,
                obliquity: 0,
                initialMeridianAngle: 0,
                progradeDirection: true,
                currentAngle: 0.0,
              },
              orbit: {
                semiMajorAxis: 7000,
                eccentricity: 0,
                inclination: 0,
                longitudeOfAscendingNode: 0,
                argumentOfPeriapsis: 0,
                meanAnomalyAtEpoch: 0,
                epoch: new Date().toISOString(),
              },
              visual: defaultVisual,
            },
          ],
        },
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
    const data = get().data;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'space_data.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  update: (result) =>
    set((state) => ({
      data: {
        ...state.data,
        stars: state.data.stars.map((star) => ({
          ...star,
          state: {
            ...star.state,
            position: result[star.id]?.position || star.state.position,
          },
          rotation: {
            ...star.rotation,
            currentAngle: result[star.id]?.rotation ?? star.rotation.currentAngle,
          }
        })),
        planets: state.data.planets.map((planet) => ({
          ...planet,
          state: {
            ...planet.state,
            position: result[planet.id]?.position || planet.state.position,
          },
          rotation: {
            ...planet.rotation,
            currentAngle: result[planet.id]?.rotation ?? planet.rotation.currentAngle,
          }
        })),
        naturalSatellites: state.data.naturalSatellites.map((sat) => ({
          ...sat,
          state: {
            ...sat.state,
            position: result[sat.id]?.position || sat.state.position,
          },
          rotation: {
            ...sat.rotation,
            currentAngle: result[sat.id]?.rotation ?? sat.rotation.currentAngle,
          }
        })),
        artificialSatellites: state.data.artificialSatellites.map((sat) => ({
          ...sat,
          state: {
            ...sat.state,
            position: result[sat.id]?.position || sat.state.position,
          },
          // rotation:{
          //   ...sat.rotation,
          //   currentAngle: result[sat.id]?.rotation ?? sat.rotation.currentAngle,
          // }
        })),
      },
    })),

  getIdTypeMapping: (type: 'star' | 'planet' | 'natural-satellite' | 'artificial-satellite') => {
    const { data } = get();
    if (type === "star") {
      return data.stars.map(star => star.id);
    } else if (type === "planet") {
      return data.planets.map(planet => planet.id);
    } else if (type === "natural-satellite") {
      return data.naturalSatellites.map(satellite => satellite.id);
    } else if (type === "artificial-satellite") {
      return data.artificialSatellites.map(satellite => satellite.id);
    }
    return [];
  }

}));