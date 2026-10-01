import { governmentServices } from "../data/services";

const pmuy = governmentServices.find(
  (service) => service.id === "pmuy"
);

export function detectService(text) {
  const value = text.toLowerCase();

  for (const service of governmentServices) {
    if (
      service.keywords.some((keyword) =>
        value.includes(keyword.toLowerCase())
      )
    ) {
      return service;
    }
  }

  return null;
}

export function detectPMUYIntent(text) {
  const service = detectService(text);

  return service?.id === "pmuy";
}

export function getPMUYQuestion(step) {
  const questions = {
    0: "நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்டவரா?",
    1: "உங்கள் குடும்பத்தில் ஏற்கனவே LPG gas connection உள்ளதா?",
    2: "உங்கள் குடும்பம் பொருளாதார ரீதியாக தகுதியான குடும்பமா?"
  };

  return questions[step] || "";
}

export function handlePMUYAnswer(step, text) {
  const value = text.toLowerCase();

  const yesWords = [
    "ஆம்",
    "ஆமாம்",
    "yes",
    "ஆமா",
    "உண்டு",
    "இருக்கு",
    "இருக்கிறது"
  ];

  const noWords = [
    "இல்லை",
    "இல்ல",
    "no",
    "இல்லைங்க",
    "கிடையாது"
  ];

  const isYes = yesWords.some((word) => value.includes(word));
  const isNo = noWords.some((word) => value.includes(word));

  if (step === 0) {
    if (isYes) {
      return {
        nextStep: 1,
        message:
          "சரி 👍 உங்கள் வயது இந்த அடிப்படை தகுதிக்கு பொருந்துகிறது. உங்கள் குடும்பத்தில் ஏற்கனவே LPG gas connection உள்ளதா?",
        completed: false
      };
    }

    if (isNo) {
      return {
        nextStep: 0,
        message:
          "இந்த திட்டத்திற்கு 18 வயது அல்லது அதற்கு மேற்பட்ட பெண் விண்ணப்பதாரராக இருக்க வேண்டும்.",
        completed: true
      };
    }
  }

  if (step === 1) {
    if (isNo) {
      return {
        nextStep: 2,
        message:
          "சரி 👍 உங்கள் குடும்பத்தில் ஏற்கனவே LPG connection இல்லை. உங்கள் குடும்பம் திட்டத்தின் பொருளாதார தகுதிக்கு உட்படுகிறதா?",
        completed: false
      };
    }

    if (isYes) {
      return {
        nextStep: 1,
        message:
          "இந்த திட்டத்தின் தகுதியில், அதே குடும்பத்தில் ஏற்கனவே LPG connection இருக்கக்கூடாது.",
        completed: true
      };
    }
  }

  if (step === 2) {
    if (isYes) {
      return {
        nextStep: 3,
        message:
          "நீங்கள் கொடுத்த தகவல்களின் அடிப்படையில் PMUY திட்டத்திற்கு தகுதி இருக்கக்கூடிய வாய்ப்பு உள்ளது. அடுத்ததாக தேவையான ஆவணங்களைத் தயாரித்து அதிகாரப்பூர்வ PMUY இணையதளத்தில் சரிபார்க்கலாம். 😊",
        completed: true
      };
    }

    if (isNo) {
      return {
        nextStep: 2,
        message:
          "இந்த திட்டம் தகுதியான குடும்பங்களைச் சேர்ந்த பெண்களுக்காக உள்ளது. அதிகாரப்பூர்வ PMUY இணையதளத்தில் உங்கள் தகுதியை சரிபார்க்கலாம்.",
        completed: true
      };
    }
  }

  return {
    nextStep: step,
    message:
      "பரவாயில்லை 😊 ஆம் அல்லது இல்லை என்று எளிமையாக சொல்லலாம்.",
    completed: false
  };
}

export { pmuy };