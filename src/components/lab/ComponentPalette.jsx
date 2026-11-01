import React, { useState } from 'react';
import { COMPONENT_DEFINITIONS } from '../../simulator/componentDefinitions.js';
import { Search, Plus, Cpu, Lightbulb, Zap, ToggleLeft, Sun, Sliders, Volume2, Thermometer, Droplets } from 'lucide-react';

const CATEGORY_ICONS = {
  Microcontrollers: Cpu,
  Prototyping: Zap,
  Outputs: Lightbulb,
  Passives: Zap,
  Inputs: ToggleLeft,
  Sensors: Sun
};

const COMPONENT_ICONS = {
  arduino: Cpu,
  breadboard: Zap,
  led: Lightbulb,
  resistor: Zap,
  button: ToggleLeft,
  ldr: Sun,
  temperature: Thermometer,
  soilMoisture: Droplets,
  potentiometer: Sliders,
  buzzer: Volume2
};

export const ComponentPalette = ({ onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const componentsList = Object.values(COMPONENT_DEFINITIONS);

  const categories = ['All', 'Microcontrollers', 'Prototyping', 'Outputs', 'Passives', 'Inputs', 'Sensors'];

  const filteredComponents = componentsList.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      
      {/* Search Header */}
      <div className="p-3.5 border-b border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-teal-600" />
            <span>Components</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
            {filteredComponents.length} items
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search parts (LED, LDR...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.map((comp) => {
          return (
            <div
              key={comp.type}
              onClick={() => onAddComponent(comp.type)}
              className="group bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl p-3 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-xs text-slate-800 group-hover:text-teal-700">
                      {comp.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                    {comp.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-6 h-6 rounded-lg bg-white group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center border border-slate-200 group-hover:border-teal-600 shadow-2xs transition-colors shrink-0 ml-2"
                  title="Add to Workbench"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pin info preview */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-500">{comp.category}</span>
                <span>{comp.pins.length} Terminals</span>
              </div>
            </div>
          );
        })}

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No components matched your filter.
          </div>
        )}
      </div>

    </div>
  );
};
