"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Lock, Unlock, Plus, Trash2 } from "lucide-react";

export default function AdminPage() {
  const {
    isAdmin, loginAdmin, logoutAdmin,
    animals, addAnimal, deleteAnimal,
    drawings, addDrawing, deleteDrawing
  } = useStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Form states for Animal
  const [animalName, setAnimalName] = useState("");
  const [animalImage, setAnimalImage] = useState("");
  const [animalAudio, setAnimalAudio] = useState("");

  // Form states for Drawing
  const [drawingName, setDrawingName] = useState("");
  const [drawingPath, setDrawingPath] = useState("");
  const [drawingViewBox, setDrawingViewBox] = useState("0 0 100 100");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setError(false);
      setPin("");
    } else {
      setError(true);
    }
  };

  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (animalName && animalImage && animalAudio) {
      addAnimal({
        id: Date.now().toString(),
        name: animalName,
        imagePath: animalImage,
        audioPath: animalAudio
      });
      setAnimalName("");
      setAnimalImage("");
      setAnimalAudio("");
      alert("¡Animal añadido exitosamente!");
    }
  };

  const handleAddDrawing = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawingName && drawingPath) {
      addDrawing({
        id: Date.now().toString(),
        name: drawingName,
        svgPaths: [drawingPath], // Simplificación para añadir al menos un path
        viewBox: drawingViewBox || "0 0 100 100"
      });
      setDrawingName("");
      setDrawingPath("");
      setDrawingViewBox("0 0 100 100");
      alert("¡Dibujo añadido exitosamente!");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navigation title="Área de Padres" />

        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <div className="flex justify-center mb-6 text-slate-400">
            <Lock size={64} />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">
            Introduce el PIN
          </h2>
          <p className="text-center text-slate-500 mb-6 text-sm">
            (Para esta demo el PIN es 12345)
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`text-center text-3xl tracking-widest p-4 rounded-xl border-2 outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-400'}`}
              placeholder="•••••"
              maxLength={5}
            />
            {error && <p className="text-red-500 text-center font-bold">PIN Incorrecto</p>}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-xl transition-colors"
            >
              Desbloquear
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="flex justify-between items-center mb-8">
        <Navigation title="Panel de Control" />
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <Unlock size={20} />
          Cerrar Sesión
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario Añadir Animal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Plus className="text-emerald-500" />
            Añadir Nuevo Animal
          </h3>
          <form onSubmit={handleAddAnimal} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
              <input
                type="text" value={animalName} onChange={(e) => setAnimalName(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-emerald-400"
                placeholder="Ej. León" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Imagen (en carpeta public/animals/)</label>
              <input
                type="text" value={animalImage} onChange={(e) => setAnimalImage(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-emerald-400"
                placeholder="Ej. leon.png" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Audio (en carpeta public/animals/)</label>
              <input
                type="text" value={animalAudio} onChange={(e) => setAnimalAudio(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-emerald-400"
                placeholder="Ej. leon.mp3" required
              />
            </div>
            <button type="submit" className="bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600">
              Guardar Animal
            </button>
          </form>
        </motion.div>

        {/* Lista de Animales Actuales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-6 md:col-span-1"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4">Animales Guardados</h3>
          <ul className="space-y-3">
            {animals.map(a => (
              <li key={a.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700">{a.name} ({a.imagePath})</span>
                <button onClick={() => deleteAnimal(a.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Formulario Añadir Dibujo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Plus className="text-blue-500" />
            Añadir Nuevo Dibujo
          </h3>
          <form onSubmit={handleAddDrawing} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Nombre del Dibujo</label>
              <input
                type="text" value={drawingName} onChange={(e) => setDrawingName(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400"
                placeholder="Ej. Pera" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">ViewBox Original del SVG</label>
              <input
                type="text" value={drawingViewBox} onChange={(e) => setDrawingViewBox(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400 font-mono text-sm"
                placeholder="0 0 100 100" required
              />
              <p className="text-xs text-slate-400 mt-1">Busca el atributo viewBox en el archivo SVG original.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Ruta SVG (atributo &apos;d&apos; de un path)</label>
              <textarea
                value={drawingPath} onChange={(e) => setDrawingPath(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400 min-h-[100px] font-mono text-sm"
                placeholder="M 10 10 C 20 20..." required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600">
              Guardar Dibujo
            </button>
          </form>
        </motion.div>

        {/* Lista de Dibujos Actuales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-6 md:col-span-1"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4">Dibujos Guardados</h3>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {drawings.map(d => (
              <li key={d.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 truncate mr-2">{d.name}</span>
                <button onClick={() => deleteDrawing(d.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
