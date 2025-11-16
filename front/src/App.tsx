import SecondStep from "./components/SecondStep";
import FirstStep from "./components/FirstStep";
import { useState } from "react";

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  return (
    <div>
      <div className="flex flex-col justify-start items-center bg-black min-h-screen">
        <h1 className="text-[40px] font-semibold text-white text-center mt-10">
          Analyze your model training on a normalized dataset
        </h1>

        <div className={`w-full flex justify-center transform transition-all duration-500 ${isUploaded
          ? "opacity-0 -translate-y-3 pointer-events-none h-0 overflow-hidden"
          : "opacity-100 translate-y-0"}`}>
          <FirstStep setIsUploaded={setIsUploaded} setAccuracy={setAccuracy} />
        </div>

        <div className={`w-full flex justify-center transform transition-all duration-500 ${isUploaded
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"}`}>
          <SecondStep accuracy={accuracy} />
        </div>
      </div>
    </div>
  );
}

export default App;
