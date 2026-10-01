import { governmentServices } from "../data/services";

const pmuy = governmentServices.find(
  (service) => service.id === "pmuy"
);

/*
 * --------------------------------
 * SERVICE DETECTION
 * --------------------------------
 *
 * Detect the user's intended service.
 *
 * IMPORTANT:
 * Specific phrases are checked first.
 * This allows the user to switch services
 * even when another service flow is active.
 */

export function detectService(text) {
  const value = text.toLowerCase().trim();

  /*
   * --------------------------------
   * PMUY / GAS
   * --------------------------------
   */

  if (
    value.includes("gas connection") ||
    value.includes("gas cylinder") ||
    value.includes("lpg") ||
    value.includes("cooking gas") ||
    value.includes("gas") ||
    value.includes("கேஸ்") ||
    value.includes("கேஸ் கனெக்ஷன்") ||
    value.includes("எரிவாயு") ||
    value.includes("சமையல் எரிவாயு") ||
    value.includes("சிலிண்டர்")
  ) {
    return governmentServices.find(
      (service) => service.id === "pmuy"
    );
  }

  /*
   * --------------------------------
   * EDUCATION
   * --------------------------------
   */

  if (
    value.includes("education") ||
    value.includes("scholarship") ||
    value.includes("scholarships") ||
    value.includes("student") ||
    value.includes("students") ||
    value.includes("school") ||
    value.includes("college") ||
    value.includes("study") ||
    value.includes("education help") ||
    value.includes("கல்வி") ||
    value.includes("உதவித்தொகை") ||
    value.includes("ஸ்காலர்ஷிப்") ||
    value.includes("மாணவர்") ||
    value.includes("மாணவி") ||
    value.includes("பள்ளி") ||
    value.includes("கல்லூரி") ||
    value.includes("படிப்பு") ||
    value.includes("கல்வி உதவி") ||
    value.includes("கட்டண உதவி")
  ) {
    return governmentServices.find(
      (service) => service.id === "education"
    );
  }

  /*
   * --------------------------------
   * JOBS / EMPLOYMENT
   * --------------------------------
   */

  if (
    value.includes("job") ||
    value.includes("jobs") ||
    value.includes("employment") ||
    value.includes("work") ||
    value.includes("career") ||
    value.includes("career help") ||
    value.includes("skill") ||
    value.includes("skills") ||
    value.includes("training") ||
    value.includes("job vacancy") ||
    value.includes("வேலை") ||
    value.includes("வேலைவாய்ப்பு") ||
    value.includes("வேலை வேண்டும்") ||
    value.includes("வேலை தேவை") ||
    value.includes("பணி") ||
    value.includes("தொழில்") ||
    value.includes("திறன்") ||
    value.includes("பயிற்சி")
  ) {
    return governmentServices.find(
      (service) => service.id === "jobs"
    );
  }

  /*
   * --------------------------------
   * HEALTH
   * --------------------------------
   */

  if (
    value.includes("health") ||
    value.includes("healthcare") ||
    value.includes("medical") ||
    value.includes("hospital") ||
    value.includes("medicine") ||
    value.includes("treatment") ||
    value.includes("doctor") ||
    value.includes("health scheme") ||
    value.includes("மருத்துவம்") ||
    value.includes("மருத்துவ உதவி") ||
    value.includes("மருத்துவமனை") ||
    value.includes("மருந்து") ||
    value.includes("சிகிச்சை") ||
    value.includes("டாக்டர்") ||
    value.includes("சுகாதாரம்") ||
    value.includes("ஆரோக்கியம்")
  ) {
    return governmentServices.find(
      (service) => service.id === "health"
    );
  }

  /*
   * --------------------------------
   * MATERNITY / PMMVY
   * --------------------------------
   */

  if (
    value.includes("pregnant") ||
    value.includes("pregnancy") ||
    value.includes("maternity") ||
    value.includes("mother") ||
    value.includes("மகப்பேறு") ||
    value.includes("கர்ப்பம்") ||
    value.includes("கர்ப்பிணி") ||
    value.includes("கர்ப்பமாக") ||
    value.includes("தாய்") ||
    value.includes("pmmvy")
  ) {
    return governmentServices.find(
      (service) => service.id === "pmmvy"
    );
  }

  /*
   * --------------------------------
   * SAKHI NIWAS / HOSTEL
   * --------------------------------
   */

  if (
    value.includes("hostel") ||
    value.includes("working women hostel") ||
    value.includes("accommodation") ||
    value.includes("stay") ||
    value.includes("room") ||
    value.includes("தங்குமிடம்") ||
    value.includes("விடுதி") ||
    value.includes("வேலை செய்யும் பெண்கள்") ||
    value.includes("தங்க")
  ) {
    return governmentServices.find(
      (service) => service.id === "sakhi-niwas"
    );
  }

  /*
   * --------------------------------
   * WOMEN HELPLINE / SOS
   * --------------------------------
   */

  if (
    value.includes("women helpline") ||
    value.includes("helpline") ||
    value.includes("emergency") ||
    value.includes("violence") ||
    value.includes("harassment") ||
    value.includes("safety") ||
    value.includes("women help") ||
    value.includes("181") ||
    value.includes("பெண்கள் உதவி") ||
    value.includes("பெண்கள் உதவி எண்") ||
    value.includes("அவசரம்") ||
    value.includes("பாதுகாப்பு") ||
    value.includes("துன்புறுத்தல்") ||
    value.includes("ஆபத்து")
  ) {
    return governmentServices.find(
      (service) => service.id === "women-helpline"
    );
  }

  /*
   * --------------------------------
   * GOVERNMENT SCHEMES / MYSCHEME
   * --------------------------------
   *
   * Tamil has different forms such as:
   *
   * திட்டம்
   * திட்டங்கள்
   * திட்டத்தை
   * திட்டங்களை
   *
   * So we check several natural phrases.
   */

  if (
    value.includes("myscheme") ||
    value.includes("government scheme") ||
    value.includes("government schemes") ||
    value.includes("scheme") ||
    value.includes("schemes") ||
    value.includes("அரசாங்க திட்டம்") ||
    value.includes("அரசாங்க திட்டங்கள்") ||
    value.includes("அரசாங்க திட்டத்தை") ||
    value.includes("அரசாங்க திட்டங்களை") ||
    value.includes("அரசு திட்டம்") ||
    value.includes("அரசு திட்டங்கள்") ||
    value.includes("அரசு திட்டத்தை") ||
    value.includes("அரசு திட்டங்களை") ||
    value.includes("திட்டம்") ||
    value.includes("திட்டங்கள்") ||
    value.includes("திட்டத்தை") ||
    value.includes("திட்டங்களை")
  ) {
    return governmentServices.find(
      (service) => service.id === "myscheme"
    );
  }

  /*
   * --------------------------------
   * FALLBACK KEYWORD DETECTION
   * --------------------------------
   */

  for (const service of governmentServices) {
    if (
      service.keywords?.some((keyword) =>
        value.includes(keyword.toLowerCase())
      )
    ) {
      return service;
    }
  }

  return null;
}

/*
 * --------------------------------
 * PMUY INTENT
 * --------------------------------
 */

export function detectPMUYIntent(text) {
  const service = detectService(text);

  return service?.id === "pmuy";
}

/*
 * --------------------------------
 * PMUY QUESTIONS
 * --------------------------------
 */

export function getPMUYQuestion(step) {
  const questions = {
    0: "நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்டவரா?",
    1: "உங்கள் குடும்பத்தில் ஏற்கனவே LPG gas connection உள்ளதா?",
    2: "உங்கள் குடும்பம் பொருளாதார ரீதியாக தகுதியான குடும்பமா?"
  };

  return questions[step] || "";
}

/*
 * --------------------------------
 * PMUY ANSWER HANDLER
 * --------------------------------
 */

export function handlePMUYAnswer(step, text) {
  const value = text.toLowerCase().trim();

  const yesWords = [
    "ஆம்",
    "ஆமாம்",
    "ஆமா",
    "yes",
    "உண்டு",
    "இருக்கு",
    "இருக்கிறது",
    "இருக்குது"
  ];

  const noWords = [
    "இல்லை",
    "இல்ல",
    "இல்லைங்க",
    "no",
    "கிடையாது",
    "இல்லன்னு"
  ];

  const isYes = yesWords.some((word) =>
    value.includes(word)
  );

  const isNo = noWords.some((word) =>
    value.includes(word)
  );

  /*
   * STEP 0
   * Age
   */

  if (step === 0) {
    if (isYes) {
      return {
        nextStep: 1,
        message:
          "சரி 👍 உங்கள் வயது இந்த அடிப்படை தகுதிக்கு பொருந்துகிறது.\n\n" +
          "உங்கள் குடும்பத்தில் ஏற்கனவே LPG gas connection உள்ளதா?",
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

  /*
   * STEP 1
   * Existing LPG connection
   */

  if (step === 1) {
    if (isNo) {
      return {
        nextStep: 2,
        message:
          "சரி 👍 உங்கள் குடும்பத்தில் ஏற்கனவே LPG connection இல்லை.\n\n" +
          "உங்கள் குடும்பம் திட்டத்தின் பொருளாதார தகுதிக்கு உட்படுகிறதா?",
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

  /*
   * STEP 2
   * Economic eligibility
   */

  if (step === 2) {
    if (isYes) {
      return {
        nextStep: 3,
        message:
          "நீங்கள் கொடுத்த தகவல்களின் அடிப்படையில் PMUY திட்டத்திற்கு தகுதி இருக்கக்கூடிய வாய்ப்பு உள்ளது.\n\n" +
          "அடுத்ததாக தேவையான ஆவணங்களைத் தயாரித்து அதிகாரப்பூர்வ PMUY இணையதளத்தில் சரிபார்க்கலாம். 😊",
        completed: true
      };
    }

    if (isNo) {
      return {
        nextStep: 2,
        message:
          "இந்த திட்டம் தகுதியான குடும்பங்களைச் சேர்ந்த பெண்களுக்காக உள்ளது.\n\n" +
          "அதிகாரப்பூர்வ PMUY இணையதளத்தில் உங்கள் தகுதியை சரிபார்க்கலாம்.",
        completed: true
      };
    }
  }

  /*
   * Unknown answer
   */

  return {
    nextStep: step,
    message:
      "பரவாயில்லை 😊\n\n" +
      "ஆம் அல்லது இல்லை என்று எளிமையாக சொல்லலாம்.",
    completed: false
  };
}

export { pmuy };