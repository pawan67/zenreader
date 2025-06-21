import { useState, useRef, useEffect, useCallback } from "react";

interface Voice {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  const isSupported = typeof window !== "undefined" && window.speechSynthesis;

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      if (isSupported) {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices
          .filter((voice) => voice.lang.startsWith("en"))
          .map((voice) => ({
            name: `${voice.name} (${voice.lang})`,
            lang: voice.lang,
            voice: voice,
          }));

        setAvailableVoices(englishVoices);

        // Set default voice
        if (englishVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(englishVoices[0].name);
        }
      }
    };

    // Load voices when they become available
    if (isSupported) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }

    return () => {
      // Cleanup speech synthesis
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedVoice, isSupported]);

  // Update speech rate for current utterance if speaking
  useEffect(() => {
    if (speechRef.current && isSpeaking && isSupported) {
      // Clamp speech rate to valid range (0.1 to 10)
      const clampedRate = Math.max(0.1, Math.min(10, speechRate));
      speechRef.current.rate = clampedRate;
      console.log("Updated speech rate to:", clampedRate); // Debug log
    }
  }, [speechRate, isSpeaking, isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!text || !isSupported) {
        console.log("Speech synthesis not supported or no text provided");
        return;
      }

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      const voice = availableVoices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice.voice;
      }

      // Set speech properties with clamped values
      utterance.rate = Math.max(0.1, Math.min(10, speechRate));
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("Creating utterance with rate:", utterance.rate); // Debug log

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        console.log("Speech started with rate:", utterance.rate); // Debug log
        options.onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        console.log("Speech ended"); // Debug log
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setIsPaused(false);
        console.error("Speech synthesis error:", event.error); // Debug log
        options.onError?.(`Speech synthesis error: ${event.error}`);
      };

      utterance.onpause = () => {
        setIsPaused(true);
        console.log("Speech paused"); // Debug log
      };

      utterance.onresume = () => {
        setIsPaused(false);
        console.log("Speech resumed"); // Debug log
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, selectedVoice, speechRate, options, isSupported]
  );

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSpeaking, isSupported]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
    }
  }, [isPaused, isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  // Custom setSpeechRate that updates current utterance if speaking
  const updateSpeechRate = useCallback(
    (newRate: number) => {
      // Clamp the rate to valid range
      const clampedRate = Math.max(0.1, Math.min(10, newRate));
      console.log("Setting speech rate to:", clampedRate); // Debug log
      setSpeechRate(clampedRate);

      // If currently speaking, update the current utterance
      if (speechRef.current && isSpeaking && isSupported) {
        speechRef.current.rate = clampedRate;
      }
    },
    [isSpeaking, isSupported]
  );

  return {
    isSpeaking,
    isPaused,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate: updateSpeechRate,
    speak,
    pause,
    resume,
    stop,
    isSupported,
  };
};
