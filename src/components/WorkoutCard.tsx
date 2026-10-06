import React, { useState } from 'react';
import { BiomechanicalExercise } from '../core/types';
import { ChevronDown, ChevronUp, ShieldCheck, Target, Clock, Dumbbell } from 'lucide-react';

interface WorkoutCardProps {
  exercise: BiomechanicalExercise;
  index: number;
  isActive?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, index, isActive = false }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div
      className={`w-full rounded-m3-lg transition-all duration-200 overflow-hidden ${
        isActive
          ? 'bg-m3-surface-container-high border-2 border-m3-primary shadow-m3-2'
          : 'bg-m3-surface-container-low border border-m3-outline-variant/50 hover:border-m3-outline/70'
      }`}
    >
      {/* Card Header */}
      <div className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-m3-full bg-m3-primary/10 text-m3-primary text-xs font-black">
              {index + 1}
            </span>
            <div>
              <h4 className="text-sm font-bold text-m3-on-surface leading-tight">
                {exercise.name}
              </h4>
              <div className="flex items-center space-x-3 mt-1 text-xs text-m3-outline font-medium">
                {exercise.sets && (
                  <span className="flex items-center space-x-1">
                    <Dumbbell className="w-3 h-3 text-m3-primary" />
                    <span>{exercise.sets} serie</span>
                  </span>
                )}
                {exercise.reps && (
                  <span className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-m3-primary" />
                    <span>{exercise.reps}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-m3-primary" />
                  <span>{Math.round(exercise.durationSeconds / 60)} min</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-m3-full text-m3-outline hover:text-m3-on-surface hover:bg-m3-surface-container transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Biomechanical Target Pill */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-m3-full bg-m3-tertiary-container/40 text-m3-on-tertiary-container text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3 text-m3-tertiary" />
            <span>Target: {exercise.injuryPreventionTarget}</span>
          </span>

          {exercise.targetJoints.map((j) => (
            <span
              key={j}
              className="px-2 py-0.5 rounded-m3-full bg-m3-surface-container text-m3-outline text-[10px] font-semibold"
            >
              {j}
            </span>
          ))}
        </div>

        {/* Biomechanical Focus Description */}
        <p className="mt-2 text-xs text-m3-on-surface-variant font-medium leading-relaxed bg-m3-surface/60 p-2 rounded-m3-md border border-m3-outline-variant/30">
          <strong className="text-m3-primary font-bold">Focus:</strong> {exercise.biomechanicalFocus}
        </p>

        {/* Expandable Execution Instructions */}
        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-m3-outline-variant/30 text-xs text-m3-on-surface leading-normal">
            <span className="font-bold text-m3-on-surface block mb-1">Istruzioni di esecuzione tecnica:</span>
            <p className="opacity-90">{exercise.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};
