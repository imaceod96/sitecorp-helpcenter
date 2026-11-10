import React from 'react';
import {
  Compass,
  HardHat,
  Calculator,
  Truck,
  Users,
  Receipt,
  BarChart3,
  BookOpen,
  FileText,
  Layers,
  Settings,
  ShieldCheck,
  FolderKanban,
  Wrench,
  Boxes,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

export const ICON_OPTIONS: { name: string; label: string; icon: React.FC<LucideProps> }[] = [
  { name: 'Compass', label: 'Primeros Pasos / Guía', icon: Compass },
  { name: 'HardHat', label: 'Construcción / Obras', icon: HardHat },
  { name: 'Calculator', label: 'Presupuestos / Costes', icon: Calculator },
  { name: 'Truck', label: 'Maquinaria / Flota', icon: Truck },
  { name: 'Users', label: 'Equipo / Cuadrillas / RRHH', icon: Users },
  { name: 'Receipt', label: 'Facturación / Compras', icon: Receipt },
  { name: 'BarChart3', label: 'Informes / Estadísticas', icon: BarChart3 },
  { name: 'BookOpen', label: 'Documentación General', icon: BookOpen },
  { name: 'FileText', label: 'Contratos / Albaranes', icon: FileText },
  { name: 'Layers', label: 'Módulos / Estructura', icon: Layers },
  { name: 'Settings', label: 'Configuración / Ajustes', icon: Settings },
  { name: 'ShieldCheck', label: 'Seguridad / Prevención PRL', icon: ShieldCheck },
  { name: 'FolderKanban', label: 'Proyectos / Planificación', icon: FolderKanban },
  { name: 'Wrench', label: 'Mantenimiento / Taller', icon: Wrench },
  { name: 'Boxes', label: 'Almacén / Materiales', icon: Boxes },
];

export const renderCategoryIcon = (iconName: string, className = 'w-6 h-6'): React.ReactNode => {
  const match = ICON_OPTIONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={className} />;
  }
  return <HelpCircle className={className} />;
};
