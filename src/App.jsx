import { useEffect, useState } from "react";

import ChatMessage from "./components/ChatMessage";
import ServiceCard from "./components/ServiceCard";
import VoiceButton from "./components/VoiceButton";

import { askSakhiAI } from "./services/gemini";

import {
  detectService,
  handlePMUYAnswer,
  pmuy,
} from "./services/pmuyFlow";

import { governmentServices } from "./data/services";

function App() {
  /*
   * --------------------------------
   * STATE
   * --------------------------------
   */

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "வணக்கம் 👋 நான் ZIVA.\n\n" +
        "உங்களுக்கு தேவையான அரசு சேவையை கண்டுபிடிக்கவும், புரிந்துகொள்ளவும் நான் உதவுகிறேன்.\n\n" +
        "தமிழில் பேசலாம் அல்லது தட்டச்சு செய்யலாம். 😊",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedService, setSelectedService] = useState(null);

  const [pmuyActive, setPmuyActive] = useState(false);
  const [pmuyStep, setPmuyStep] = useState(0);

  const [theme, setTheme] = useState(
    localStorage.getItem("ziva-theme") || "light"
  );

  /*
   * --------------------------------
   * THEME
   * --------------------------------
   */

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }

    localStorage.setItem("ziva-theme", theme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((current) => {
      if (current === "light") {
        return "dark";
      }

      if (current === "dark") {
        return "saffron";
      }

      return "light";
    });
  };

  /*
   * --------------------------------
   * TEXT TO SPEECH
   * --------------------------------
   */

  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis is not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
        ""
      )
      .trim();

    if (!cleanText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      cleanText
    );

    utterance.lang = "ta-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const tamilVoice = voices.find((voice) =>
      voice.lang?.toLowerCase().startsWith("ta")
    );

    if (tamilVoice) {
      utterance.voice = tamilVoice;

      console.log(
        "Using Tamil voice:",
        tamilVoice.name,
        tamilVoice.lang
      );
    } else {
      console.warn("Tamil TTS voice was not found.");
    }

    window.speechSynthesis.speak(utterance);
  };

  /*
   * --------------------------------
   * ADD ASSISTANT MESSAGE
   * --------------------------------
   */

  const addAssistantMessage = (
    text,
    shouldSpeak = true
  ) => {
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text,
      },
    ]);

    if (shouldSpeak) {
      speak(text);
    }
  };

  /*
   * --------------------------------
   * ADD USER MESSAGE
   * --------------------------------
   */

  const addUserMessage = (text) => {
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text,
      },
    ]);
  };

  /*
   * --------------------------------
   * RESET SERVICE STATE
   * --------------------------------
   */

  const resetServiceState = (service) => {
    setPmuyActive(false);
    setPmuyStep(0);
    setSelectedService(service);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  /*
   * --------------------------------
   * START PMUY
   * --------------------------------
   */

  const startPMUY = () => {
    resetServiceState(pmuy);

    setPmuyActive(true);
    setPmuyStep(0);

    setMessages([
      {
        role: "assistant",
        text:
          "🔥 பிரதான் மந்திரி உஜ்வலா யோஜனா\n\n" +
          "உங்கள் LPG gas connection தேவையைப் பற்றி உதவுகிறேன். 😊",
      },
    ]);

    const question =
      "நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்டவரா?";

    setTimeout(() => {
      addAssistantMessage(question);
    }, 0);
  };

  /*
   * --------------------------------
   * START NORMAL SERVICE
   * --------------------------------
   */

  const startNormalService = (service) => {
    resetServiceState(service);

    let firstMessage =
      "வணக்கம் 👋 நான் ZIVA.\n\n" +
      `${service.icon} ${service.tamilName}\n\n` +
      `${service.description}\n\n` +
      "இந்த சேவையைப் பற்றி உங்களுக்கு உதவுகிறேன். 😊";

    /*
     * EDUCATION
     */

    if (service.id === "education") {
      firstMessage =
        "🎓 கல்வி அல்லது scholarship உதவி தேடுகிறீர்களா?\n\n" +
        "உங்கள் தேவையை எளிமையாக சொல்லுங்கள். உதாரணமாக:\n\n" +
        "• scholarship வேண்டும்\n" +
        "• கல்லூரி கட்டண உதவி வேண்டும்\n" +
        "• மாணவருக்கான அரசு திட்டம் வேண்டும்";
    }

    /*
     * JOBS
     */

    if (service.id === "jobs") {
      firstMessage =
        "💼 வேலை அல்லது வேலைவாய்ப்பு உதவி தேடுகிறீர்களா?\n\n" +
        "உங்களுக்கு தேவையானதை சொல்லுங்கள். உதாரணமாக:\n\n" +
        "• வேலை தேடுகிறேன்\n" +
        "• skill training வேண்டும்\n" +
        "• அரசு வேலை தேடுகிறேன்";
    }

    /*
     * HEALTH
     */

    if (service.id === "health") {
      firstMessage =
        "🏥 மருத்துவம் அல்லது சுகாதார உதவி தேடுகிறீர்களா?\n\n" +
        "உங்களுக்கு தேவையான மருத்துவ உதவியை எளிமையாக சொல்லுங்கள்.\n\n" +
        "அதற்கேற்ற அரசு திட்டங்களை கண்டுபிடிக்க உதவுகிறேன்.";
    }

    /*
     * WOMEN HELPLINE
     */

    if (service.id === "women-helpline") {
      firstMessage =
        "🆘 நீங்கள் பாதுகாப்பு அல்லது அவசர உதவி தேடுகிறீர்கள் என்றால், " +
        "பெண்கள் உதவி எண் 181-ஐ தொடர்பு கொள்ளலாம்.\n\n" +
        "உங்களுக்கு உடனடி ஆபத்து இருந்தால், அருகிலுள்ள அவசர சேவையையும் தொடர்பு கொள்ளுங்கள்.";
    }

    /*
     * SAKHI NIWAS
     */

    if (service.id === "sakhi-niwas") {
      firstMessage =
        "🏠 வேலை செய்யும் பெண்களுக்கான தங்குமிடம் பற்றிய தகவலை பார்க்கலாம்.\n\n" +
        "உங்கள் பகுதியில் Sakhi Niwas வசதி உள்ளதா என்பதையும், " +
        "அந்த facility-யின் admission requirements-ஐயும் சரிபார்க்க வேண்டும்.";
    }

    /*
     * PMMVY
     */

    if (service.id === "pmmvy") {
      firstMessage =
        "🤰 PMMVY பற்றிய தகவலை பார்க்கலாம்.\n\n" +
        "உங்கள் நிலைக்கு பொருந்துமா என்பதை அதிகாரப்பூர்வ PMMVY தகவலுடன் சரிபார்க்கலாம்.";
    }

    /*
     * MYSCHEME
     */

    if (service.id === "myscheme") {
      firstMessage =
        "🔎 அரசு திட்டங்களைத் தேடலாம்.\n\n" +
        "உங்கள் வயது, கல்வி, வேலை, வருமானம் அல்லது தேவையை சொல்லுங்கள்.\n\n" +
        "அதற்கேற்ற அரசு திட்டங்களை கண்டுபிடிக்க உதவுகிறேன்.";
    }

    setMessages([
      {
        role: "assistant",
        text: firstMessage,
      },
    ]);

    setTimeout(() => {
      speak(firstMessage);
    }, 0);
  };

  /*
   * --------------------------------
   * SWITCH SERVICE
   * --------------------------------
   */

  const switchToService = (service) => {
    if (!service) {
      return;
    }

    setLoading(false);
    setInput("");

    if (service.id === "pmuy") {
      startPMUY();
      return;
    }

    startNormalService(service);
  };

  /*
   * --------------------------------
   * HELP INTENT
   * --------------------------------
   */

  const isHelpMessage = (text) => {
    const helpWords = [
      "எனக்கு புரியவில்லை",
      "புரியவில்லை",
      "எனக்குத் தெரியவில்லை",
      "தெரியவில்லை",
      "understand",
      "don't understand",
      "dont understand",
      "i don't know",
      "i dont know",
    ];

    return helpWords.some((word) =>
      text.toLowerCase().includes(word.toLowerCase())
    );
  };

  /*
   * --------------------------------
   * SEND MESSAGE
   * --------------------------------
   */

  const sendMessage = async (text) => {
    const userMessage = text.trim();

    if (!userMessage || loading) {
      return;
    }

    setInput("");

    /*
     * --------------------------------
     * SERVICE DETECTION FIRST
     * --------------------------------
     *
     * This is the most important part.
     *
     * Even if PMUY is currently active,
     * the user can switch to another service.
     *
     * Example:
     *
     * PMUY asks:
     * "Are you 18 or above?"
     *
     * User says:
     * "எனக்கு வேலை வேண்டும்"
     *
     * ZIVA switches to Jobs instead of
     * treating the sentence as a PMUY answer.
     */

    const detectedService = detectService(userMessage);

    if (
      detectedService &&
      detectedService.id !== selectedService?.id
    ) {
      /*
       * Show the user's message first.
       */
      addUserMessage(userMessage);

      /*
       * Small delay lets React render the
       * user's message before the new service
       * conversation is displayed.
       */
      setTimeout(() => {
        switchToService(detectedService);
      }, 0);

      return;
    }

    /*
     * --------------------------------
     * ADD NORMAL USER MESSAGE
     * --------------------------------
     */

    addUserMessage(userMessage);

    /*
     * --------------------------------
     * HELP INTENT
     * --------------------------------
     */

    if (isHelpMessage(userMessage)) {
      addAssistantMessage(
        "பரவாயில்லை 😊\n\n" +
          "நான் மிகவும் எளிமையாக கேட்கிறேன்.\n\n" +
          "உங்கள் தேவையை ஒரு வார்த்தையில் சொல்லலாம்.\n\n" +
          "🔥 Gas connection\n" +
          "🎓 கல்வி / scholarship\n" +
          "🏥 மருத்துவ உதவி\n" +
          "💼 வேலை\n" +
          "🏠 தங்குமிடம்\n" +
          "🆘 பெண்கள் உதவி\n" +
          "🔎 அரசு திட்டங்கள்"
      );

      return;
    }

    /*
     * --------------------------------
     * PMUY ACTIVE
     * --------------------------------
     */

    if (pmuyActive) {
      const result = handlePMUYAnswer(
        pmuyStep,
        userMessage
      );

      addAssistantMessage(result.message);

      if (result.completed) {
        setPmuyActive(false);
        setPmuyStep(0);
        setSelectedService(pmuy);
      } else {
        setPmuyStep(result.nextStep);
      }

      return;
    }

    /*
     * --------------------------------
     * LOCAL SERVICE DETECTION
     * --------------------------------
     */

    if (detectedService) {
      switchToService(detectedService);
      return;
    }

    /*
     * --------------------------------
     * GEMINI
     * --------------------------------
     */

    setLoading(true);

    try {
      const result = await askSakhiAI(
        userMessage,
        selectedService
          ? `${selectedService.name}: ${selectedService.description}`
          : ""
      );

      if (result?.response) {
        addAssistantMessage(result.response);
      }

      /*
       * Gemini can also suggest a service.
       */

      if (result?.selectedServiceId) {
        const service =
          governmentServices.find(
            (item) =>
              item.id === result.selectedServiceId
          );

        if (service) {
          switchToService(service);
        }
      }
    } catch (error) {
      console.error("ZIVA AI error:", error);

      addAssistantMessage(
        "மன்னிக்கவும் 😊 இப்போது சிறிய தொழில்நுட்ப சிக்கல் உள்ளது.\n\n" +
          "கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்வு செய்து முயற்சிக்கலாம்."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------
   * QUICK ACTION
   * --------------------------------
   */

  const handleQuickAction = (serviceId) => {
    const service = governmentServices.find(
      (item) => item.id === serviceId
    );

    if (!service) {
      return;
    }

    switchToService(service);
  };

  /*
   * --------------------------------
   * UI
   * --------------------------------
   */

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <div className="logo">
            <img
              src="/favicon.svg"
              alt="ZIVA logo"
            />
          </div>

          <div>
            <h1>ZIVA</h1>

            <p>
              Government services, in your language.
            </p>
          </div>

        </div>

        <div className="header-right">

          <span className="powered">
            Powered by Google Gemini
          </span>

          <button
            type="button"
            className="theme-button"
            onClick={changeTheme}
            title="Change theme"
          >
            {theme === "light" && "🌙"}
            {theme === "dark" && "☀️"}
            {theme === "saffron" && "🌿"}
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="main">

        {/* HERO */}

        <section className="hero">

          <span className="badge">
            AI GOVERNMENT SERVICE NAVIGATOR
          </span>

          <h2>
            அரசு சேவைகள்.
            <br />
            உங்கள் மொழியில்.
          </h2>

          <p>
            உங்கள் தேவையை தமிழில் சொல்லுங்கள்.
            ZIVA உங்களுக்கு பொருத்தமான அரசு
            சேவையை புரிந்துகொள்ள உதவும்.
          </p>

          <div className="hero-points">

            <div className="hero-point">
              <span>🎙️</span>
              குரலில் பேசலாம்
            </div>

            <div className="hero-point">
              <span>💬</span>
              எளிய தமிழில் வழிகாட்டுதல்
            </div>

            <div className="hero-point">
              <span>🔗</span>
              அதிகாரப்பூர்வ தகவல்களுக்கு இணைப்பு
            </div>

          </div>

        </section>


        {/* CHAT */}

        <section className="chat-container">

          {/* VOICE HERO */}

          <div className="voice-hero">

            <div className="voice-hero-text">

              <h3>
                உங்கள் தேவையை சொல்லுங்கள் 👋
              </h3>

              <p>
                தட்டச்சு செய்ய வேண்டிய அவசியமில்லை.
                தமிழில் பேசலாம்.
              </p>

            </div>

            <VoiceButton
              onTranscript={(text) => {
                setInput(text);
                sendMessage(text);
              }}
            />

          </div>


          {/* MESSAGES */}

          <div className="messages">

            {messages.map(
              (message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                />
              )
            )}

            {loading && (
              <div className="message-row ai-row">

                <div className="message ai-message typing">
                  ZIVA யோசிக்கிறது... ⏳
                </div>

              </div>
            )}

            {selectedService && (
              <ServiceCard
                service={selectedService}
              />
            )}

          </div>


          {/* QUICK ACTIONS */}

          <div className="quick-title">
            உங்களுக்கு என்ன தேவை?
          </div>

          <div className="quick-actions">

            <button
              type="button"
              onClick={() =>
                handleQuickAction("pmuy")
              }
            >
              🔥 Gas
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("education")
              }
            >
              🎓 கல்வி
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("jobs")
              }
            >
              💼 வேலை
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("health")
              }
            >
              🏥 மருத்துவம்
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("pmmvy")
              }
            >
              🤰 மகப்பேறு
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("sakhi-niwas")
              }
            >
              🏠 தங்குமிடம்
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("women-helpline")
              }
            >
              🆘 SOS
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickAction("myscheme")
              }
            >
              🔎 திட்டங்கள்
            </button>

          </div>


          {/* INPUT */}

          <form
            className="input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="உங்களுக்கு என்ன உதவி வேண்டும்?"
              disabled={loading}
            />

            <VoiceButton
              onTranscript={(text) => {
                setInput(text);
                sendMessage(text);
              }}
            />

            <button
              type="submit"
              className="send-button"
              disabled={
                !input.trim() || loading
              }
              aria-label="Send message"
            >
              ➤
            </button>

          </form>


          {/* HELP */}

          <div className="help-buttons">

            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "எனக்கு புரியவில்லை"
                )
              }
            >
              ❓ புரியவில்லை
            </button>

            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "எனக்குத் தெரியவில்லை"
                )
              }
            >
              💡 தெரியவில்லை
            </button>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer>

        <p>
          ZIVA · Government services, in your language.
        </p>

        <span>
          AI guidance only · Always verify with official sources
        </span>

      </footer>

    </div>
  );
}

export default App;