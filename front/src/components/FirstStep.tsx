import React, { useState } from 'react'

const FirstStep = () => {

    const [file, setFile] = useState<File | null>(null);
    const [accuracy, setAccuracy] = useState<number>()

    const handleFileChange = (e: any) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected)
    }

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file)

            const res = await fetch("http://localhost:8000/analyze-dataset", {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
                throw new Error("error while analyzing dataset")
            }

            const data = await res.json()
            setAccuracy(data.accuracy)
        } catch (err: any) {
            throw new Error("error on handle upload.")
        }
    }


    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className="text-xl font-semibold text-black">
                1. Download your normalized csv dataset
            </h1>
            <input type="file" accept=".csv" onChange={handleFileChange} className="border p-3" />

            <button className="text-xl border border-black p-3 mt-3 cursor-pointer" onClick={handleUpload}>Analyze</button>
            {accuracy && <p>Accuracy: {accuracy}</p>}
        </div>
    )
}

export default FirstStep