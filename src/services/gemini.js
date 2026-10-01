import { getAI, getGenerativeModel } from "firebase/ai";
import { app } from "../firebase";

const ai = getAI(app);

const model = getGenerativeModel(ai, {
  model: "gemini-3.6-flash",

  systemInstruction: `
You are ZIVA, a simple government-service assistant for women in India.

Your job is to help a first-time user understand government services in simple Tamil.

Rules:
- Respond in simple Tamil by default.
- Ask only one question at a time.
- Never assume the user's answer.
- If the user says they don't understand, explain more simply.
- If the user says they don't know, explain what information is needed.
- Never invent eligibility rules, benefits, documents, deadlines, or application status.
- Never claim that an application has been submitted.
- Use only the government-service information provided by the application.
- Be respectful, patient, and encouraging.

Return a JSON object with:
{
  "intent": "string",
  "selectedServiceId": "string or null",
  "response": "string",
  "nextAction": "string",
  "needsMoreInformation": true or false,
  "question": "string or null"
}
`
});

const fallbackResponse = {
  intent: "help",
  selectedServiceId: null,
  response:
    "😊 உங்கள் கேள்வியை இன்னும் எளிமையாக சொல்ல முடியுமா?\n\n🔥 Gas connection\n🤰 மகப்பேறு உதவி\n💼 வேலை\n🏠 தங்குமிடம்\n🔎 அரசாங்க திட்டங்கள்",
  nextAction: "show_service_options",
  needsMoreInformation: true,
  question: null
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function askSakhiAI(userMessage, serviceContext = "") {
  const prompt = `
User message:
${userMessage}

Available service information:
${serviceContext || "No specific service selected."}

Help the user based only on the information above.
`;

  // First attempt
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiResponse(text);
  } catch (error) {
    console.warn("Gemini first attempt failed:", error);

    // Small delay before retry
    await sleep(1000);
  }

  // Second attempt
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseGeminiResponse(text);
  } catch (error) {
    console.warn("Gemini second attempt failed:", error);

    // Never expose the Gemini/API error to the user
    return fallbackResponse;
  }
}

function parseGeminiResponse(text) {
  try {
    // Remove markdown code fences if Gemini adds them
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      intent: parsed.intent || "general_help",
      selectedServiceId: parsed.selectedServiceId || null,
      response:
        parsed.response ||
        fallbackResponse.response,
      nextAction:
        parsed.nextAction ||
        "continue_conversation",
      needsMoreInformation:
        parsed.needsMoreInformation ?? false,
      question: parsed.question || null
    };
  } catch (error) {
    console.warn("Could not parse Gemini response:", error);

    return {
      ...fallbackResponse,
      response: text || fallbackResponse.response
    };
  }
}