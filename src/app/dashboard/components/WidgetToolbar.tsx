"use client";
import {
  Square, Circle, Triangle, Image as Img, FileText, MousePointer,
  Hand, Pen, Eraser, Scissors, Pencil, Type, Camera, Video,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move, Plus,
  Minus, Star, Heart, Bookmark, Clock, Calendar, Music,
  Play, Pause, StopCircle, Trash2, Download, Upload,
  Link as LinkIcon, Eye, EyeOff, Lock, Unlock, Zap,
  Cloud, Sun, Moon, Layers, Code, File
} from "lucide-react";
import { useDashboardUI } from "../ui";

const tools = [
  Square, Circle, Triangle, Img, FileText, MousePointer,
  Hand, Pen, Eraser, Scissors, Pencil, Type, Camera, Video,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move, Plus,
  Minus, Star, Heart, Bookmark, Clock, Calendar, Music,
  Play, Pause, StopCircle, Trash2, Download, Upload,
  LinkIcon, Eye, EyeOff, Lock, Unlock, Zap,
  Cloud, Sun, Moon, Layers, Code, File,
];

export default function WidgetToolbar() {
  const { fullscreen, toggleFullscreen } = useDashboardUI();
  if (!fullscreen) return null;
  return (
    <aside className="fixed right-4 top-20 z-50 grid grid-cols-2 gap-2 bg-[var(--dashboard-sidebar)] p-3 rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">
      {tools.map((Icon, i) => (
        <button key={i} className="p-2 hover:bg-white/10 rounded">
          <Icon className="w-5 h-5" />
        </button>
      ))}
      <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded col-span-2 mt-2">
        Salir
      </button>
    </aside>
  );
}
