import { useEffect, useRef, useState, useCallback } from 'react';
import { usePrayerContext } from '../_context/PrayerContext';
import { Prayer } from '../_utils/types'; // Or from where Prayer is exported

export const useAudioPlayer = () => {
  const { state, dispatch } = usePrayerContext();
  const { selectedPrayer, currentLineIndex, isPlaying, audioMode, speed } = state;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Effect for Audio Event Listeners (timeupdate, loadeddata, error, ended)
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !selectedPrayer?.audioSrc) {
      // Ensure audioLoaded is false if there's no audio source
      if (!selectedPrayer?.audioSrc) setAudioLoaded(false);
      return;
    }

    const handleTimeUpdate = () => {
      if (audioMode === 'sync' && isPlaying && selectedPrayer?.audioTimings) {
        const currentTime = audioElement.currentTime;
        const timings = selectedPrayer.audioTimings;
        let newLineIndex = 0;
        for (let i = 0; i < timings.length; i++) {
          if (i < timings.length - 1) {
            if (currentTime >= timings[i] && currentTime < timings[i + 1]) {
              newLineIndex = i;
              break;
            }
          } else if (currentTime >= timings[i]) {
            newLineIndex = i;
          }
        }
        if (newLineIndex !== currentLineIndex) {
          dispatch({ type: 'SELECT_LINE', lineIndex: newLineIndex });
        }
      }
    };

    const handleAudioLoaded = () => {
      setAudioLoaded(true);
      setAudioError(null);
      // Adjust playback rate if needed when audio is loaded/reloaded
      if (speed !== 2000) {
        audioElement.playbackRate = 2000 / speed;
      } else {
        audioElement.playbackRate = 1.0;
      }
    };

    const handleAudioError = () => {
      setAudioLoaded(false);
      setAudioError('ไม่สามารถโหลดไฟล์เสียงได้');
    };

    const handleAudioEnded = () => {
      if (audioMode === 'continuous') { // In 'continuous' mode, reset and pause
        dispatch({ type: 'RESET' });
        dispatch({ type: 'PAUSE' });
      } else if (audioMode === 'sync') { // In 'sync' mode, just pause at the end
        dispatch({ type: 'PAUSE' });
      }
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadeddata', handleAudioLoaded);
    audioElement.addEventListener('error', handleAudioError);
    audioElement.addEventListener('ended', handleAudioEnded);

    // Initial load for the selected prayer's audio source
    if (selectedPrayer.audioSrc && audioElement.src !== selectedPrayer.audioSrc) {
        audioElement.src = selectedPrayer.audioSrc;
        audioElement.load();
        setAudioLoaded(false); // Set loading until 'loadeddata' fires
    } else if (!selectedPrayer.audioSrc) {
        audioElement.src = '';
        setAudioLoaded(false);
    }


    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadeddata', handleAudioLoaded);
      audioElement.removeEventListener('error', handleAudioError);
      audioElement.removeEventListener('ended', handleAudioEnded);
    };
  }, [selectedPrayer, audioMode, isPlaying, currentLineIndex, speed, dispatch]);


  // Function to explicitly load audio for a prayer (e.g., when selected)
  const loadAudioForPrayer = useCallback((prayer: Prayer | null) => {
    setAudioLoaded(false);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (prayer?.audioSrc) {
        audioRef.current.src = prayer.audioSrc;
        audioRef.current.load(); // This will trigger 'loadeddata' or 'error'
      } else {
        audioRef.current.src = '';
        setAudioLoaded(false); // No src, so not loaded
      }
    }
  }, []);

  // Effect to load audio when selectedPrayer changes
  useEffect(() => {
    loadAudioForPrayer(selectedPrayer);
  }, [selectedPrayer, loadAudioForPrayer]);


  // Control Functions (play, pause, reset)
  const playAudio = useCallback(() => {
    if (audioRef.current && selectedPrayer?.audioSrc && audioLoaded) {
      if (audioMode === 'sync' && selectedPrayer.audioTimings) {
        const timing = selectedPrayer.audioTimings[currentLineIndex];
        if (timing !== undefined && Math.abs(audioRef.current.currentTime - timing) > 0.5) { // Check if significantly different
          audioRef.current.currentTime = timing;
        }
      }
      audioRef.current.playbackRate = (speed === 2000) ? 1.0 : (2000 / speed);
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setAudioError("ไม่สามารถเล่นเสียงได้ โปรดลองใหม่อีกครั้ง");
      });
    } else if (!selectedPrayer?.audioSrc) {
       // If there's no audio source, we might still want 'isPlaying' to drive the line-by-line advance
       // This case is handled by useInterval in page.tsx based on isPlaying state
    }
  }, [selectedPrayer, audioLoaded, audioMode, currentLineIndex, speed]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current && selectedPrayer?.audioSrc) {
      audioRef.current.pause();
    }
  }, [selectedPrayer]);

  const resetAudio = useCallback(() => { // This function is defined but not used by effects. Might be for direct call.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Synchronize play/pause state with audio element
  useEffect(() => {
    if(isPlaying) {
        playAudio();
    } else {
        pauseAudio();
    }
  }, [isPlaying, playAudio, pauseAudio]);

  // Adjust playback rate when speed changes
  useEffect(() => {
    if (audioRef.current && selectedPrayer?.audioSrc && audioLoaded) {
        audioRef.current.playbackRate = (speed === 2000) ? 1.0 : (2000 / speed);
    }
  }, [speed, selectedPrayer, audioLoaded]);


  return { audioRef, audioLoaded, audioError, loadAudioForPrayer }; // Expose what PrayerLyricsLoop needs
};
