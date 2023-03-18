import { type NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [fetching, setFetching] = useState(false);
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  useEffect(() => {
    const download = async () => {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });
      return res.json();
    };
    const transcribe = async (fileName: string) => {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
        }),
      });
      if (!res.ok) throw new Error("Failed to transcribe audio");

      return res.json();
    };

    if (!fetching) return;

    download()
      .then((res) => {
        transcribe(res.fileName);
      })
      .then((res) => {
        setSummary(res.summary);
      })
      .catch((error) => console.log(error));

    setFetching(false);
  }, [fetching]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-clip bg-slate-100">
      <div className="mx-auto mt-8 flex w-96 flex-col gap-4 ">
        <h1 className="text-4xl font-bold text-slate-900">Youtube Summary</h1>
        <input
          className="rounded-lg border border-slate-900"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="rounded-lg border border-slate-900 bg-slate-900 text-white"
          onClick={() => setFetching(true)}
        >
          Generate Summary
        </button>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <p className="text-slate-900">{summary || ""}</p>
      </div>
    </div>
  );
};

export default Home;
