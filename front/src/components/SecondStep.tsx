import { useState } from "react";
import LimeBarChart from "./LimeBarChart";
import TrainingWindow from "./TrainingWindow";

type SecondStepProps = {
    accuracy: number | null;
};

function SecondStep({ accuracy }: SecondStepProps) {
    const [lime, setLime] = useState<boolean>(false);
    const [data, setData] = useState<{
        feature_names: string[];
        mean_contrib: number[];
        n_samples_used: number;
    } | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [gptResponse, setGptResponse] = useState<string | null>(null);
    const [explaining, setExplaining] = useState(false);

    const analyzeGraph = async () => {
        try {
            setExplaining(true);
            const res = await fetch("http://localhost:8000/gpt-analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("couldn't analyze gpt data");
            }

            const resData = await res.json();
            setGptResponse(resData.explanation);
        } catch (error: any) {
            throw new Error("Couldn't explain the graph");
        } finally {
            setExplaining(false);
        }
    };

    const analyzeTraining = async () => {
        try {
            setAnalyzing(true);
            const res = await fetch("http://localhost:8000/analyze-probabilities", {
                method: "POST",
            });

            const data = await res.json();
            setData(data);
            setLime(true);
        } catch (err) {
            console.error("fetch error:", err);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10 bg-black">
            {accuracy !== null && <TrainingWindow accuracy={accuracy} />}

            <h1 className="text-2xl font-semibold text-white">
                2. Analyze model training features
            </h1>

            <button disabled={analyzing} className={`text-md border text-white border-white p-3 mt-3 transform duration-150
                ${analyzing
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-white hover:text-black hover:font-semibold hover:scale-105"
                }`} onClick={analyzeTraining}>
                {analyzing ? "Analyzing..." : "Analyze"}
            </button>

            {lime && data && (
                <LimeBarChart
                    featureNames={data.feature_names}
                    meanContrib={data.mean_contrib}
                />
            )}

            {data && (
                <div className="flex flex-col items-center justify-center">
                    <button disabled={explaining} className={`border border-white text-white transform duration-150 p-3 mt-4
                        ${explaining
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:bg-white hover:text-black hover:font-semibold hover:scale-105"
                        }`} onClick={analyzeGraph}>
                        {explaining ? "Generating explanation..." : "Explain me the graph"}
                    </button>
                </div>
            )}

            {gptResponse && (
                <div className="mt-10 w-full max-w-2xl bg-gray-400 mb-10 rounded-xl p-5 space-y-4">
                    {gptResponse.split("\n").map((line, i) => (
                        <p key={i} className={`text-lg ${i < 2 ? "font-semibold text-black" : "text-white"}`}>
                            {line.trim()}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SecondStep;
