import { createContext, useContext, Dispatch } from 'react';
import { PrayerState, ActionType } // Assuming ActionType is the correct name for actions from prayerReducer
from '../_utils/prayerReducer'; // Adjust path as necessary

export interface PrayerContextType {
  state: PrayerState;
  dispatch: Dispatch<ActionType>;
}

// Create the context with a default undefined value.
// We'll ensure the provider passes a valid value.
export const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

// Custom hook to use the PrayerContext
export const usePrayerContext = () => {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayerContext must be used within a PrayerProvider');
  }
  return context;
};
