import SecondStep from "./components/SecondStep";
import FirstStep from "./components/FirstStep";
import { useState } from "react";


function App() {

  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="">
      <div className="flex flex-col justify-start items-center bg-black min-h-screen">
        <FirstStep setIsUploaded={setIsUploaded} />

        <div
          className={`
          w-full flex justify-center
          transform transition-all duration-500
          ${isUploaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}
        `}
        >
          <SecondStep />
        </div>

      </div>
    </div>
  )
}

export default App
