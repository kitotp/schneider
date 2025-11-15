import { useState } from "react";
import LimeBarChart from "./LimeBarChart";

function SecondStep() {

    const [lime, setLime] = useState<boolean>(false)
    const [data, setData] = useState<{
        feature_names: string[];
        mean_contrib: number[];
        n_samples_used: number;
    } | null>(null);

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
        <div className="flex flex-col items-center justify-center mt-3">
            <h1 className="text-xl font-semibold text-black">
                2. Analyze model training
            </h1>

            <button className="text-xl border border-black p-3 mt-3 cursor-pointer" onClick={analyzeTraining}>Model training</button>
            {(lime && data) ? (
                <LimeBarChart featureNames={data.feature_names} meanContrib={data.mean_contrib} />
            ) : <p>waiting for data...</p>}
        </div>
    )
}

export default SecondStep