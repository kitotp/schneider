import { useState } from "react";
import LimeBarChart from "./LimeBarChart";

function SecondStep() {

    const [lime, setLime] = useState<boolean>(false)
    const [data, setData] = useState<{
        feature_names: string[];
        mean_contrib: number[];
        n_samples_used: number;
    } | null>(null);

    const [gptResponse, setGptResponse] = useState<string | null>(null)

    const analyzeGraph = async () => {
        const res = await fetch('http://localhost:8000/gpt-analyze', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            throw new Error("couldn't analyze gpt data")
        }

        const resData = await res.json()

        setGptResponse(resData.explanation)
    }

    const analyzeTraining = async () => {
        try {
            console.log("➡️ calling /analyze-probabilities");

            const res = await fetch("http://localhost:8000/analyze-probabilities", {
                method: "POST",
            });

            console.log("status:", res.status);

            const data = await res.json();
            setData(data)
            setLime(true)
        } catch (err) {
            console.error("fetch error:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-3 bg-black">
            <h1 className="text-xl font-semibold text-white">
                2. Analyze model training
            </h1>

            <button className="text-xl border text-white border-white p-3 mt-3 cursor-pointer" onClick={analyzeTraining}>Model training</button>
            {(lime && data) ? (
                <LimeBarChart featureNames={data.feature_names} meanContrib={data.mean_contrib} />
            ) : <p className="text-white">waiting for data...</p>}

            {data &&
                <div className='flex flex-col items-center justify-center'>
                    <button className='border border-white text-white cursor-pointer hover:scale-105 transform duration-150 hover:bg-white hover:text-black hover:font-semibold p-3' onClick={analyzeGraph}>Explain me the graph</button>
                </div>
            }
            {gptResponse && (
                <div className="mt-6 w-full max-w-2xl bg-gray-400 rounded-xl p-5 space-y-4">
                    {gptResponse
                        .split('\n')
                        .map((line, i) => (
                            <p key={i} className={`text-lg ${i < 2 ? "font-semibold text-black" : "text-white"}`}>
                                {line.trim()}
                            </p>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default SecondStep