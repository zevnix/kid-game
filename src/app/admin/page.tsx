"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Lock, Unlock, Plus, Trash2, Edit2 } from "lucide-react";

export default function AdminPage() {
  const {
    panelRole, loginPanel, logoutPanel,
    generalSettings, updateGeneralSettings,
    animals, addAnimal, deleteAnimal,
    drawings, addDrawing, deleteDrawing,
    colors, addColor, deleteColor,
    shapes, addShape, deleteShape
  } = useStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "animals" | "drawings" | "colors" | "shapes" | "letters">("general");

  // Form states for General
  const [title, setTitle] = useState(generalSettings.gameTitle);
  const [bgMusic, setBgMusic] = useState(generalSettings.bgMusicUrl);
  const [bgImage, setBgImage] = useState(generalSettings.bgImageUrl);

  // Form states for Animal
  const [animalId, setAnimalId] = useState(""); // If empty, it's adding new. If set, it's editing.
  const [animalName, setAnimalName] = useState("");
  const [animalImage, setAnimalImage] = useState("");
  const [animalAudio, setAnimalAudio] = useState("");

  // Form states for Drawing
  const [drawingId, setDrawingId] = useState("");
  const [drawingName, setDrawingName] = useState("");
  const [drawingPath, setDrawingPath] = useState("");
  const [drawingViewBox, setDrawingViewBox] = useState("0 0 100 100");

  // Form states for Color
  const [colorId, setColorId] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [colorAudio, setColorAudio] = useState("");

  // Form states for Shape
  const [shapeId, setShapeId] = useState("");
  const [shapeName, setShapeName] = useState("");
  const [shapeSvg, setShapeSvg] = useState("");
  const [shapeAudio, setShapeAudio] = useState("");

  // Form states for Letters
  const { letters, updateLetter } = useStore();
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [letterWord, setLetterWord] = useState("");
  const [letterIcon, setLetterIcon] = useState("");
  const [letterImage, setLetterImage] = useState("");
  const [letterAudio, setLetterAudio] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPanel(pin)) {
      setError(false);
      setPin("");
    } else {
      setError(true);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralSettings({ gameTitle: title, bgMusicUrl: bgMusic, bgImageUrl: bgImage });
    alert("¡Ajustes generales guardados exitosamente!");
  };

  const { updateAnimal, updateDrawing, updateColor, updateShape } = useStore();

  const handleAddAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (animalName && animalImage && animalAudio) {
      const payload = { id: animalId || Date.now().toString(), name: animalName, imagePath: animalImage, audioPath: animalAudio };
      if (animalId) updateAnimal(payload);
      else addAnimal(payload);
      setAnimalId(""); setAnimalName(""); setAnimalImage(""); setAnimalAudio("");
      alert(`¡Animal ${animalId ? "actualizado" : "añadido"} exitosamente!`);
    }
  };

  const handleAddDrawing = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawingName && drawingPath) {
      const payload = { id: drawingId || Date.now().toString(), name: drawingName, svgPaths: [drawingPath], viewBox: drawingViewBox || "0 0 100 100" };
      if (drawingId) updateDrawing(payload);
      else addDrawing(payload);
      setDrawingId(""); setDrawingName(""); setDrawingPath(""); setDrawingViewBox("0 0 100 100");
      alert(`¡Dibujo ${drawingId ? "actualizado" : "añadido"} exitosamente!`);
    }
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (colorName && colorHex) {
      const payload = { id: colorId || Date.now().toString(), name: colorName, hexCode: colorHex, audioPath: colorAudio };
      if (colorId) updateColor(payload);
      else addColor(payload);
      setColorId(""); setColorName(""); setColorAudio("");
      alert(`¡Color ${colorId ? "actualizado" : "añadido"} exitosamente!`);
    }
  };

  const handleAddShape = (e: React.FormEvent) => {
    e.preventDefault();
    if (shapeName && shapeSvg) {
      const payload = { id: shapeId || Date.now().toString(), name: shapeName, svgString: shapeSvg, audioPath: shapeAudio };
      if (shapeId) updateShape(payload);
      else addShape(payload);
      setShapeId(""); setShapeName(""); setShapeSvg(""); setShapeAudio("");
      alert(`¡Forma ${shapeId ? "actualizada" : "añadida"} exitosamente!`);
    }
  };

  const handleAddLetterExample = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLetter = letters.find(l => l.id === selectedLetter);
    if (targetLetter && letterWord) {
      if (targetLetter.examples.length >= 5) {
        alert("Máximo 5 ejemplos permitidos por letra.");
        return;
      }
      updateLetter({
        ...targetLetter,
        examples: [...targetLetter.examples, { word: letterWord, icon: letterIcon || "🌟", imagePath: letterImage, audioPath: letterAudio }]
      });
      setLetterWord(""); setLetterIcon(""); setLetterImage(""); setLetterAudio("");
      alert(`¡Ejemplo añadido a la letra ${selectedLetter}!`);
    }
  };

  const removeLetterExample = (letterId: string, wordToRemove: string) => {
    const targetLetter = letters.find(l => l.id === letterId);
    if (targetLetter) {
      updateLetter({
        ...targetLetter,
        examples: targetLetter.examples.filter(ex => ex.word !== wordToRemove)
      });
    }
  };

  if (!panelRole) {
    return (
      <div className="min-h-screen">
        <Navigation title="Área de Ajustes" />

        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <div className="flex justify-center mb-6 text-slate-400">
            <Lock size={64} />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">
            Introduce el PIN
          </h2>
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-6 text-center">
            <p className="font-bold mb-2">Claves de Prueba:</p>
            <p>Admin Global: <b>admin123</b></p>
            <p>Padres (Local): <b>padres123</b></p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`text-center text-3xl tracking-widest p-4 rounded-xl border-2 outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-400'}`}
              placeholder="••••••••"
              maxLength={15}
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Navigation title={`Ajustes (${panelRole === 'admin' ? 'Admin Global' : 'Padres Local'})`} />
        <button
          onClick={logoutPanel}
          className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl font-bold transition-colors"
        >
          <Unlock size={20} />
          Cerrar Sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 pb-2 border-b-2 border-slate-200">
        {(["general", "animals", "drawings", "colors", "shapes", "letters"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-t-2xl font-bold capitalize transition-colors whitespace-nowrap ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === "general" ? "General" : tab === "animals" ? "Animales" : tab === "drawings" ? "Pintar" : tab === "colors" ? "Colores" : tab === "shapes" ? "Formas" : "Letras"}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* TAB GENERAL */}
        {activeTab === "general" && panelRole === "admin" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 md:col-span-2 max-w-2xl">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">Configuración General (Solo Admin)</h3>
            <form onSubmit={handleSaveGeneral} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Título del Juego</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. ¡Aprende Jugando!" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">URL / Archivo de Música de Fondo (Opcional)</label>
                <input type="text" value={bgMusic} onChange={(e) => setBgMusic(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. https://.../musica.mp3 o public/general/bg.mp3" />
                <p className="text-xs text-slate-400 mt-1">Sugerencia: Puedes colocar el archivo en public/general/ y escribir la ruta aquí.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">URL / Archivo de Imagen de Fondo (Opcional)</label>
                <input type="text" value={bgImage} onChange={(e) => setBgImage(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. https://.../fondo.jpg o /general/fondo.png" />
              </div>
              <button type="submit" className="bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 mt-2">Guardar Cambios Globales</button>
            </form>
          </motion.div>
        )}
        {activeTab === "general" && panelRole === "parent" && (
          <div className="md:col-span-2 text-center text-slate-500 mt-10">
            Los ajustes globales del juego solo pueden ser modificados por el Administrador.
          </div>
        )}

        {/* TAB ANIMALES */}
        {activeTab === "animals" && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="text-emerald-500" /> {animalId ? 'Editar' : 'Añadir'} Animal</h3>
              <form onSubmit={handleAddAnimal} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={animalName} onChange={(e) => setAnimalName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Imagen (public/animals/)</label>
                  <input type="text" value={animalImage} onChange={(e) => setAnimalImage(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Audio (public/animals/)</label>
                  <input type="text" value={animalAudio} onChange={(e) => setAnimalAudio(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600">Guardar</button>
                  {animalId && <button type="button" onClick={() => { setAnimalId(""); setAnimalName(""); setAnimalImage(""); setAnimalAudio(""); }} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300">Cancelar</button>}
                </div>
              </form>
            </motion.div>

            {panelRole === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Gestión Global</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                  {animals.map(a => (
                    <li key={a.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700">{a.name}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setAnimalId(a.id); setAnimalName(a.name); setAnimalImage(a.imagePath); setAnimalAudio(a.audioPath); }} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => deleteAnimal(a.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* TAB DIBUJOS */}
        {activeTab === "drawings" && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="text-blue-500" /> {drawingId ? 'Editar' : 'Añadir'} Dibujo</h3>
              <form onSubmit={handleAddDrawing} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={drawingName} onChange={(e) => setDrawingName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">ViewBox Original (Ej. 0 0 512 512)</label>
                  <input type="text" value={drawingViewBox} onChange={(e) => setDrawingViewBox(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Ruta SVG (atributo d)</label>
                  <textarea value={drawingPath} onChange={(e) => setDrawingPath(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono text-sm min-h-[100px]" required />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600">Guardar</button>
                  {drawingId && <button type="button" onClick={() => { setDrawingId(""); setDrawingName(""); setDrawingPath(""); setDrawingViewBox("0 0 100 100"); }} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300">Cancelar</button>}
                </div>
              </form>
            </motion.div>

            {panelRole === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Gestión Global</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                  {drawings.map(d => (
                    <li key={d.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700">{d.name}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setDrawingId(d.id); setDrawingName(d.name); setDrawingPath(d.svgPaths[0] || ""); setDrawingViewBox(d.viewBox || "0 0 100 100"); }} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => deleteDrawing(d.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* TAB COLORES */}
        {activeTab === "colors" && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="text-purple-500" /> {colorId ? 'Editar' : 'Añadir'} Color</h3>
              <form onSubmit={handleAddColor} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Color (Hexadecimal)</label>
                  <div className="flex gap-2">
                    <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="h-12 w-12 rounded cursor-pointer" />
                    <input type="text" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="flex-1 p-3 rounded-xl border-2 border-slate-200 uppercase font-mono" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Audio Opcional (public/colors/)</label>
                  <input type="text" value={colorAudio} onChange={(e) => setColorAudio(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. rojo.mp3" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600">Guardar</button>
                  {colorId && <button type="button" onClick={() => { setColorId(""); setColorName(""); setColorHex("#000000"); setColorAudio(""); }} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300">Cancelar</button>}
                </div>
              </form>
            </motion.div>

            {panelRole === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Gestión Global</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                  {colors.map(c => (
                    <li key={c.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-slate-300" style={{ backgroundColor: c.hexCode }} />
                        <span className="font-bold text-slate-700">{c.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setColorId(c.id); setColorName(c.name); setColorHex(c.hexCode); setColorAudio(c.audioPath || ""); }} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => deleteColor(c.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* TAB FORMAS */}
        {activeTab === "shapes" && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="text-cyan-500" /> {shapeId ? 'Editar' : 'Añadir'} Forma</h3>
              <form onSubmit={handleAddShape} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={shapeName} onChange={(e) => setShapeName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Código SVG (interior del viewBox 0 0 100 100)</label>
                  <textarea value={shapeSvg} onChange={(e) => setShapeSvg(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200 font-mono text-sm min-h-[100px]" placeholder="<circle cx='50' cy='50' r='45' fill='red' />" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Archivo de Audio Opcional (public/shapes/)</label>
                  <input type="text" value={shapeAudio} onChange={(e) => setShapeAudio(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. circulo.mp3" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-600">Guardar</button>
                  {shapeId && <button type="button" onClick={() => { setShapeId(""); setShapeName(""); setShapeSvg(""); setShapeAudio(""); }} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300">Cancelar</button>}
                </div>
              </form>
            </motion.div>

            {panelRole === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Gestión Global</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                  {shapes.map(s => (
                    <li key={s.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700">{s.name}</span>
                      <div className="flex gap-1">
                        <button onClick={() => { setShapeId(s.id); setShapeName(s.name); setShapeSvg(s.svgString); setShapeAudio(s.audioPath || ""); }} className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => deleteShape(s.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* TAB LETRAS */}
        {activeTab === "letters" && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="text-pink-500" /> Añadir Ejemplo a Letra</h3>
              <form onSubmit={handleAddLetterExample} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Seleccionar Letra</label>
                  <select
                    value={selectedLetter} onChange={(e) => setSelectedLetter(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-slate-200"
                  >
                    {letters.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Palabra de Ejemplo</label>
                  <input type="text" value={letterWord} onChange={(e) => setLetterWord(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. Araña" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Emoji Opcional</label>
                  <input type="text" value={letterIcon} onChange={(e) => setLetterIcon(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. 🕷️" maxLength={2} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Imagen Real Opcional (public/letters/)</label>
                  <input type="text" value={letterImage} onChange={(e) => setLetterImage(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. arana.png" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Audio Opcional (public/letters/)</label>
                  <input type="text" value={letterAudio} onChange={(e) => setLetterAudio(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-200" placeholder="Ej. arana.mp3" />
                </div>
                <button type="submit" className="bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600">Guardar Ejemplo</button>
              </form>
            </motion.div>

            {panelRole === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4">Gestión Global de Letras (Solo Letra Seleccionada: {selectedLetter})</h3>
                <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                  {letters.find(l => l.id === selectedLetter)?.examples.map((ex, i) => (
                    <li key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700">{ex.icon} {ex.word} {ex.imagePath ? '(Img)' : ''}</span>
                      <button onClick={() => removeLetterExample(selectedLetter, ex.word)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </li>
                  ))}
                  {letters.find(l => l.id === selectedLetter)?.examples.length === 0 && (
                    <p className="text-slate-400 text-sm text-center">No hay ejemplos para esta letra.</p>
                  )}
                </ul>
              </motion.div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
