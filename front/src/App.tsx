import SecondStep from "./components/SecondStep";
import FirstStep from "./components/FirstStep";


function App() {
  

  return (
    <div className="p-3">
      <div className="flex flex-col justify-center items-center">
        <FirstStep />

        <SecondStep />

      </div>
    </div>
  )
}

export default App
