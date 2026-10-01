import { useState } from "react";

export default function VoiceButton({ onTranscript }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("இந்த browser-ல் voice recognition support இல்லை.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ta-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <button
      className={`voice-button ${listening ? "listening" : ""}`}
      onClick={startListening}
      type="button"
    >
      {listening ? "🔴 கேட்கிறேன்..." : "🎙️ பேசுங்கள்"}
    </button>
  );
}