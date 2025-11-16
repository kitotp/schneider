import React, { useState } from "react";

type FirstStepProps = {
    setIsUploaded: (v: boolean) => void;
    setAccuracy: (v: number) => void;
};

const FirstStep = ({ setIsUploaded, setAccuracy }: FirstStepProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [training, setTraining] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file || training) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            setTraining(true);

            const res = await fetch("http://localhost:8000/analyze-dataset", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("error while analyzing dataset");
            }

            const data = await res.json();

            setAccuracy(data.accuracy);
            setIsUploaded(true);
        } catch (err) {
            console.error("error on handle upload.", err);
        } finally {
            setTraining(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <h1 className="text-2xl font-semibold text-white">
                1. Download your normalized csv dataset and train the model
            </h1>

            <label
                htmlFor="file-upload"
                className="mt-3 border px-5 py-3 border-white text-white w-[400px] cursor-pointer  hover:bg-white hover:text-black hover:font-semibold transform hover:scale-105 duration-300 "
            >
                {file ? (
                    <span className="font-medium">You have chosen {file.name}</span>
                ) : (
                    <span>Choose CSV File</span>
                )}
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                disabled={training}
                className={`text-md transform duration-300 border border-white text-white p-3 mt-3 ${training
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-white hover:text-black hover:font-semibold hover:scale-105"
                    }`}
                onClick={handleUpload}
            >
                {training ? "Training..." : "Train kNN"}
            </button>
        </div>
    );
};

export default FirstStep;
