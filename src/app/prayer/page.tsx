'use client';

import React, { useReducer } from 'react';
// Removed Metadata import as it's not in the original, can be added if needed by user
import { PrayerContext } from './_context/PrayerContext';
import { prayerReducer, initialState } from './_utils/prayerReducer';
import PrayerContent from './_components/PrayerContent';
// prayerData is no longer imported here; PrayerContent handles its own data or gets it via props.
// Other specific component imports (LineNavigation, Sidebar, etc.) are removed.
// Other hook imports (useState, useEffect, useRef, useMemo, useCallback, useAudioPlayer, useWindowSize, useInterval) are removed.
// Prayer type import is removed.

// If Metadata was here, it would be preserved, for example:
// export const metadata: Metadata = {
//   title: "บทสวดมนต์ | มงคลสิริ",
//   description: "หน้ารวมบทสวดมนต์พร้อมเสียงนำสวด",
// };

export default function PrayerLyricsLoop() {
  const [state, dispatch] = useReducer(prayerReducer, initialState);

  // The initial check for prayerData.length and selectedPrayer to show "ไม่พบข้อมูลบทสวด"
  // is now handled within PrayerContent. The initialState setup in the reducer
  // correctly assigns selectedPrayer: prayerData.length > 0 ? prayerData[0] : null,
  // which PrayerContent uses.

  return (
    <PrayerContext.Provider value={{ state, dispatch }}>
      <PrayerContent />
    </PrayerContext.Provider>
  );
}