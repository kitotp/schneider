import SecondStep from "./components/SecondStep";
import FirstStep from "./components/FirstStep";


function App() {


  return (
    <div className="">
      <div className="flex flex-col justify-start items-center bg-black min-h-screen">
        <FirstStep />

        <SecondStep />

      </div>
    </div>
  )
}

export default App
