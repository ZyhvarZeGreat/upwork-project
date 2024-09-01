
import './App.css'
import { DonutChart } from './sections/DonutChart'
import { BubbleChart } from './sections/BubbleChart'

function App() {


  return (
    <div className='bg-red-50 flex h-screen w-screen'>
      <BubbleChart />
      <DonutChart />
    </div>
  )
}

export default App
