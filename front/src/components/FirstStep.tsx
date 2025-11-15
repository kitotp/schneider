import React, { useState } from 'react'

type FirstStepProps = {
    setIsUploaded: (v: boolean) => void
}

const FirstStep = ({ setIsUploaded }: { setIsUploaded: (v: boolean) => void }) => {

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

            setIsUploaded(true);
        } catch (err: any) {
            throw new Error("error on handle upload.")
        }
    }


    return (
        <div className='flex flex-col items-center justify-center mt-30'>
            <h1 className="text-2xl font-semibold text-white">
                1. Download your normalized csv dataset
            </h1>

            <label htmlFor="file-upload" className="mt-3 border px-5 py-3 border-white text-white w-[400px] cursor-pointer  hover:bg-white hover:text-black hover:font-semibold transform hover:scale-105 duration-300 ">
                Choose CSV File
            </label>
            <input id='file-upload' type="file" accept=".csv" onChange={handleFileChange} className="hidden" />

            <button className="text-md hover:bg-white hover:text-black hover:font-semibold transform duration-300 hover:scale-105 border border-white text-white p-3 mt-3 cursor-pointer " onClick={handleUpload}>Analyze</button>
            {accuracy && <p className='text-white font-semibold mt-2'>Accuracy: {accuracy}</p>}
        </div>
    )
}

export default FirstStep