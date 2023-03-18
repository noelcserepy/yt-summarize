import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi, Configuration } from "openai";
import ytdl, { chooseFormat } from "ytdl-core";
import * as fs from "fs/promises";

// const configuration = new Configuration({
//   organization: process.env.OPENAI_ORG,
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body as { url: string };
  const videoId = ytdl.getURLVideoID(url);
  const fileName = `./files/audio/${videoId}.mp3`;
  // const info = await ytdl.getInfo(videoId);
  // const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  const stream = ytdl(url, {
    quality: "lowestaudio",
  });
  await fs.writeFile(fileName, stream);
  res.status(200).json({
    fileName,
  });
}
