import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi, Configuration } from "openai";
import * as fs from "fs";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName } = req.body as { fileName: string };
  console.log("filename", fileName);

  const transcript = await openai.createTranscription(
    fs.createReadStream(fileName),
    "whisper-1"
  );
  const text = transcript.data.text.toString();
  console.log("transcript", text);

  const systemPrompt = fs.readFileSync("./files/prompts/system.txt", "utf8");
  const user = fs.readFileSync("./files/prompts/user.txt", "utf8");
  const userPrompt = user.replace("<TEXT>", text);

  const summary = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const textSummary = summary.data.choices[0].message.content.toString();
  console.log("summary", textSummary);

  res.status(200).json({ summary: textSummary });
}
