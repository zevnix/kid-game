import { create } from 'zustand';

export interface Animal {
  id: string;
  name: string;
  emoji: string;
  soundText: string;
}

export interface ColoringDrawing {
  id: string;
  name: string;
  svgPaths: string[]; // Simplificado: array de comandos 'd' de un SVG o similar
}

interface AppState {
  stars: number;
  addStar: () => void;
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  drawings: ColoringDrawing[];
  addDrawing: (drawing: ColoringDrawing) => void;
}

const DEFAULT_ANIMALS: Animal[] = [
  { id: '1', name: 'Perro', emoji: '🐶', soundText: '¡Guau guau!' },
  { id: '2', name: 'Gato', emoji: '🐱', soundText: '¡Miau miau!' },
  { id: '3', name: 'Vaca', emoji: '🐄', soundText: '¡Muuu!' },
  { id: '4', name: 'Cerdo', emoji: '🐷', soundText: '¡Oink oink!' },
];

const DEFAULT_DRAWINGS: ColoringDrawing[] = [
  {
    id: '1',
    name: 'Manzana',
    // Un circulo y un palito muy simple
    svgPaths: [
      'M 50 20 C 70 0, 90 20, 80 50 C 70 80, 30 80, 20 50 C 10 20, 30 0, 50 20 Z', // cuerpo de la manzana
      'M 50 20 Q 50 10 60 5' // tallo
    ]
  }
];

export const useStore = create<AppState>((set) => ({
  stars: 0,
  addStar: () => set((state) => ({ stars: state.stars + 1 })),

  isAdmin: false,
  loginAdmin: (pin: string) => {
    // Seguridad básica solicitada: Evitar que cualquiera haga cambios
    if (pin === '12345') {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },
  logoutAdmin: () => set({ isAdmin: false }),

  animals: DEFAULT_ANIMALS,
  addAnimal: (animal) => set((state) => ({ animals: [...state.animals, animal] })),

  drawings: DEFAULT_DRAWINGS,
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
}));
