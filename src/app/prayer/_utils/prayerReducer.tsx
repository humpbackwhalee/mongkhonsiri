import { Prayer } from './types';
import prayerData from '../../data/prayerData';
export type PrayerState = {
  selectedPrayer: Prayer | null;
  currentLineIndex: number;
  isPlaying: boolean;
  audioMode: 'continuous' | 'sync';
  speed: number;
};

type ActionType =
  | { type: 'SELECT_PRAYER'; prayer: Prayer }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'NEXT_LINE' }
  | { type: 'PREV_LINE' }
  | { type: 'SELECT_LINE'; lineIndex: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'TOGGLE_AUDIO_MODE' };


export const initialState: PrayerState = {
  selectedPrayer: prayerData.length > 0 ? prayerData[0] : null,
  currentLineIndex: 0,
  isPlaying: false,
  audioMode: 'continuous',
  speed: 2000,
};

export const prayerReducer = (state: PrayerState, action: ActionType): PrayerState => {
  switch (action.type) {
    case 'SELECT_PRAYER':
      return {
        ...initialState,
        selectedPrayer: action.prayer,
        currentLineIndex: 0,
        speed: state.speed,
        audioMode: state.audioMode,
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESET':
      return { ...state, currentLineIndex: 0 };
    case 'NEXT_LINE':
      return {
        ...state,
        currentLineIndex: Math.min(
          state.currentLineIndex + 1,
          (state.selectedPrayer?.prayerText.length || 1) - 1
        ),
      };
    case 'PREV_LINE':
      return {
        ...state,
        currentLineIndex: Math.max(state.currentLineIndex - 1, 0),
      };
    case 'SELECT_LINE':
      return {
        ...state,
        currentLineIndex: action.lineIndex,
      };
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    case 'TOGGLE_AUDIO_MODE':
      return {
        ...state,
        audioMode: state.audioMode === 'sync' ? 'continuous' : 'sync',
      };
    default:
      return state;
  }
};