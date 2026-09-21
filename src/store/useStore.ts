import { create } from 'zustand';

export interface Animal {
  id: string;
  name: string;
  imagePath: string; // Ejemplo: 'vaca.png'
  audioPath: string; // Ejemplo: 'vaca.mp3'
}

export interface User {
  name: string;
  birthDate: string;
}

export interface ColoringDrawing {
  id: string;
  name: string;
  svgPaths: string[]; // Simplificado: array de comandos 'd' de un SVG o similar
  viewBox?: string; // Permitir que el dibujo defina su propio tamaño
}

interface AppState {
  currentUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  stars: number;
  addStar: () => void;
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  deleteAnimal: (id: string) => void;
  updateAnimal: (animal: Animal) => void;
  drawings: ColoringDrawing[];
  addDrawing: (drawing: ColoringDrawing) => void;
  deleteDrawing: (id: string) => void;
  updateDrawing: (drawing: ColoringDrawing) => void;
}

const DEFAULT_ANIMALS: Animal[] = [
  // Ejemplos para que la UI no rompa, pero esperando archivos reales
  { id: '1', name: 'Perro', imagePath: 'perro.png', audioPath: 'perro.mp3' },
  { id: '2', name: 'Gato', imagePath: 'gato.png', audioPath: 'gato.mp3' },
  { id: '3', name: 'Vaca', imagePath: 'vaca.png', audioPath: 'vaca.mp3' },
];

const DEFAULT_DRAWINGS: ColoringDrawing[] = [
  {
    id: '1',
    name: 'Manzana',
    // Un circulo y un palito muy simple
    svgPaths: [
      'M 50 20 C 70 0, 90 20, 80 50 C 70 80, 30 80, 20 50 C 10 20, 30 0, 50 20 Z', // cuerpo de la manzana
      'M 50 20 Q 50 10 60 5' // tallo
    ],
    viewBox: '0 0 100 100'
  }
];

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  loginUser: (user) => set({ currentUser: user }),
  logoutUser: () => set({ currentUser: null, stars: 0 }),

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
  deleteAnimal: (id) => set((state) => ({ animals: state.animals.filter(a => a.id !== id) })),
  updateAnimal: (animal) => set((state) => ({ animals: state.animals.map(a => a.id === animal.id ? animal : a) })),

  drawings: DEFAULT_DRAWINGS,
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  deleteDrawing: (id) => set((state) => ({ drawings: state.drawings.filter(d => d.id !== id) })),
  updateDrawing: (drawing) => set((state) => ({ drawings: state.drawings.map(d => d.id === drawing.id ? drawing : d) })),
}));
