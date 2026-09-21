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
  svgPaths: string[];
  viewBox?: string;
}

export interface ColorItem {
  id: string;
  name: string;
  hexCode: string;
  audioPath?: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  svgString: string; // Guardado como string puro del SVG para CMS
  audioPath?: string;
}

export interface LetterExample {
  id: string; // Ej. 'A'
  examples: { word: string, icon: string, imagePath?: string, audioPath?: string }[];
}

interface AppState {
  currentUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  stars: number;
  addStar: () => void;
  panelRole: 'admin' | 'parent' | null;
  loginPanel: (pin: string) => boolean;
  logoutPanel: () => void;
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  deleteAnimal: (id: string) => void;
  updateAnimal: (animal: Animal) => void;
  drawings: ColoringDrawing[];
  addDrawing: (drawing: ColoringDrawing) => void;
  deleteDrawing: (id: string) => void;
  updateDrawing: (drawing: ColoringDrawing) => void;

  colors: ColorItem[];
  addColor: (color: ColorItem) => void;
  deleteColor: (id: string) => void;
  updateColor: (color: ColorItem) => void;

  shapes: ShapeItem[];
  addShape: (shape: ShapeItem) => void;
  deleteShape: (id: string) => void;
  updateShape: (shape: ShapeItem) => void;

  letters: LetterExample[];
  updateLetter: (letter: LetterExample) => void;
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

const DEFAULT_COLORS: ColorItem[] = [
  { id: 'red', name: 'Rojo', hexCode: '#ef4444' },
  { id: 'blue', name: 'Azul', hexCode: '#3b82f6' },
  { id: 'green', name: 'Verde', hexCode: '#22c55e' },
  { id: 'yellow', name: 'Amarillo', hexCode: '#facc15' },
  { id: 'orange', name: 'Naranja', hexCode: '#f97316' },
  { id: 'purple', name: 'Morado', hexCode: '#a855f7' },
  { id: 'pink', name: 'Rosa', hexCode: '#f472b6' },
  { id: 'black', name: 'Negro', hexCode: '#0f172a' },
];

const DEFAULT_SHAPES: ShapeItem[] = [
  { id: 'circle', name: 'Círculo', svgString: '<circle cx="50" cy="50" r="45" fill="#f43f5e" />' },
  { id: 'square', name: 'Cuadrado', svgString: '<rect x="10" y="10" width="80" height="80" rx="10" fill="#3b82f6" />' },
  { id: 'triangle', name: 'Triángulo', svgString: '<polygon points="50,10 90,90 10,90" fill="#22c55e" strokeLinejoin="round" />' },
  { id: 'star', name: 'Estrella', svgString: '<polygon points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35" fill="#eab308" strokeLinejoin="round" />' }
];

const DEFAULT_LETTERS: LetterExample[] = [
  { id: "A", examples: [{ word: "Araña", icon: "🕷️" }, { word: "Árbol", icon: "🌳" }, { word: "Avión", icon: "✈️" }, { word: "Abeja", icon: "🐝" }, { word: "Anillo", icon: "💍" }] },
  { id: "B", examples: [{ word: "Barco", icon: "⛵" }, { word: "Búho", icon: "🦉" }, { word: "Balón", icon: "⚽" }, { word: "Bicicleta", icon: "🚲" }, { word: "Bota", icon: "👢" }] },
  { id: "C", examples: [{ word: "Coche", icon: "🚗" }, { word: "Casa", icon: "🏠" }, { word: "Cerdo", icon: "🐷" }, { word: "Cereza", icon: "🍒" }, { word: "Cama", icon: "🛏️" }] },
  { id: "D", examples: [{ word: "Dado", icon: "🎲" }, { word: "Delfín", icon: "🐬" }, { word: "Dedo", icon: "👆" }, { word: "Dinosaurio", icon: "🦖" }, { word: "Dulce", icon: "🍬" }] },
  { id: "E", examples: [{ word: "Elefante", icon: "🐘" }, { word: "Estrella", icon: "⭐" }, { word: "Escoba", icon: "🧹" }, { word: "Espejo", icon: "🪞" }, { word: "Erizo", icon: "🦔" }] },
  { id: "F", examples: [{ word: "Fresa", icon: "🍓" }, { word: "Fuego", icon: "🔥" }, { word: "Flor", icon: "🌻" }, { word: "Foca", icon: "🦭" }, { word: "Fantasma", icon: "👻" }] },
  { id: "G", examples: [{ word: "Gato", icon: "🐱" }, { word: "Gallo", icon: "🐓" }, { word: "Globo", icon: "🎈" }, { word: "Guitarra", icon: "🎸" }, { word: "Galleta", icon: "🍪" }] },
  { id: "H", examples: [{ word: "Hielo", icon: "🧊" }, { word: "Helado", icon: "🍦" }, { word: "Hueso", icon: "🦴" }, { word: "Hongo", icon: "🍄" }, { word: "Hada", icon: "🧚" }] },
  { id: "I", examples: [{ word: "Isla", icon: "🏝️" }, { word: "Iguana", icon: "🦎" }, { word: "Imán", icon: "🧲" }, { word: "Iglesia", icon: "⛪" }, { word: "Insecto", icon: "🐛" }] },
  { id: "J", examples: [{ word: "Jirafa", icon: "🦒" }, { word: "Jugo", icon: "🧃" }, { word: "Juguete", icon: "🧸" }, { word: "Jaula", icon: "🪤" }, { word: "Jabón", icon: "🧼" }] },
  { id: "K", examples: [{ word: "Koala", icon: "🐨" }, { word: "Kiwi", icon: "🥝" }, { word: "Karate", icon: "🥋" }, { word: "Kayak", icon: "🛶" }, { word: "Kiosko", icon: "🛖" }] },
  { id: "L", examples: [{ word: "Luna", icon: "🌙" }, { word: "León", icon: "🦁" }, { word: "Lápiz", icon: "✏️" }, { word: "Loro", icon: "🦜" }, { word: "Libro", icon: "📖" }] },
  { id: "M", examples: [{ word: "Manzana", icon: "🍎" }, { word: "Mono", icon: "🐒" }, { word: "Mariposa", icon: "🦋" }, { word: "Mano", icon: "🖐️" }, { word: "Mesa", icon: "🪵" }] },
  { id: "N", examples: [{ word: "Nube", icon: "☁️" }, { word: "Naranja", icon: "🍊" }, { word: "Niño", icon: "👦" }, { word: "Nido", icon: "🪹" }, { word: "Nieve", icon: "❄️" }] },
  { id: "O", examples: [{ word: "Oso", icon: "🐻" }, { word: "Ojo", icon: "👁️" }, { word: "Oveja", icon: "🐑" }, { word: "Oruga", icon: "🐛" }, { word: "Oreja", icon: "👂" }] },
  { id: "P", examples: [{ word: "Perro", icon: "🐶" }, { word: "Pato", icon: "🦆" }, { word: "Pelota", icon: "🏀" }, { word: "Pez", icon: "🐟" }, { word: "Pera", icon: "🍐" }] },
  { id: "Q", examples: [{ word: "Queso", icon: "🧀" }, { word: "Químico", icon: "🧪" }, { word: "Quetzal", icon: "🐦" }, { word: "Quince", icon: "1️⃣5️⃣" }, { word: "Quiosco", icon: "🏪" }] },
  { id: "R", examples: [{ word: "Ratón", icon: "🐭" }, { word: "Rana", icon: "🐸" }, { word: "Reloj", icon: "⌚" }, { word: "Rosa", icon: "🌹" }, { word: "Regalo", icon: "🎁" }] },
  { id: "S", examples: [{ word: "Sol", icon: "☀️" }, { word: "Sapo", icon: "🐸" }, { word: "Silla", icon: "🪑" }, { word: "Serpiente", icon: "🐍" }, { word: "Sombrero", icon: "🎩" }] },
  { id: "T", examples: [{ word: "Tren", icon: "🚂" }, { word: "Tigre", icon: "🐯" }, { word: "Taza", icon: "☕" }, { word: "Tomate", icon: "🍅" }, { word: "Tijera", icon: "✂️" }] },
  { id: "U", examples: [{ word: "Uva", icon: "🍇" }, { word: "Unicornio", icon: "🦄" }, { word: "Uña", icon: "💅" }, { word: "Universo", icon: "🌌" }, { word: "Urna", icon: "🗳️" }] },
  { id: "V", examples: [{ word: "Vaca", icon: "🐄" }, { word: "Vaso", icon: "🥛" }, { word: "Vestido", icon: "👗" }, { word: "Volcán", icon: "🌋" }, { word: "Violín", icon: "🎻" }] },
  { id: "W", examples: [{ word: "Waffle", icon: "🧇" }, { word: "Wifi", icon: "📶" }, { word: "Waterpolo", icon: "🤽" }, { word: "Web", icon: "🕸️" }, { word: "Windsurf", icon: "🏄" }] },
  { id: "X", examples: [{ word: "Xilófono", icon: "🎹" }, { word: "Rayos X", icon: "🩻" }] },
  { id: "Y", examples: [{ word: "Yoyo", icon: "🪀" }, { word: "Yate", icon: "🛥️" }, { word: "Yogur", icon: "🍦" }, { word: "Yema", icon: "🥚" }] },
  { id: "Z", examples: [{ word: "Zorro", icon: "🦊" }, { word: "Zapato", icon: "👞" }, { word: "Zanahoria", icon: "🥕" }, { word: "Zoológico", icon: "🦒" }, { word: "Zafiro", icon: "💎" }] }
];

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  loginUser: (user) => set({ currentUser: user }),
  logoutUser: () => set({ currentUser: null, stars: 0 }),

  stars: 0,
  addStar: () => set((state) => ({ stars: state.stars + 1 })),

  panelRole: null,
  loginPanel: (pin: string) => {
    // Simulando base de datos: Rol admin y rol padre
    if (pin === 'admin123') {
      set({ panelRole: 'admin' });
      return true;
    } else if (pin === 'padres123') {
      set({ panelRole: 'parent' });
      return true;
    }
    return false;
  },
  logoutPanel: () => set({ panelRole: null }),

  animals: DEFAULT_ANIMALS,
  addAnimal: (animal) => set((state) => ({ animals: [...state.animals, animal] })),
  deleteAnimal: (id) => set((state) => ({ animals: state.animals.filter(a => a.id !== id) })),
  updateAnimal: (animal) => set((state) => ({ animals: state.animals.map(a => a.id === animal.id ? animal : a) })),

  drawings: DEFAULT_DRAWINGS,
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  deleteDrawing: (id) => set((state) => ({ drawings: state.drawings.filter(d => d.id !== id) })),
  updateDrawing: (drawing) => set((state) => ({ drawings: state.drawings.map(d => d.id === drawing.id ? drawing : d) })),

  colors: DEFAULT_COLORS,
  addColor: (color) => set((state) => ({ colors: [...state.colors, color] })),
  deleteColor: (id) => set((state) => ({ colors: state.colors.filter(c => c.id !== id) })),
  updateColor: (color) => set((state) => ({ colors: state.colors.map(c => c.id === color.id ? color : c) })),

  shapes: DEFAULT_SHAPES,
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  deleteShape: (id) => set((state) => ({ shapes: state.shapes.filter(s => s.id !== id) })),
  updateShape: (shape) => set((state) => ({ shapes: state.shapes.map(s => s.id === shape.id ? shape : s) })),

  letters: DEFAULT_LETTERS,
  updateLetter: (letter) => set((state) => ({ letters: state.letters.map(l => l.id === letter.id ? letter : l) })),
}));
