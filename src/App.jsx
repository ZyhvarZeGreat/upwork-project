import axios from 'axios';
import { useState, useEffect } from 'react';
import { BubbleChart } from './sections/BubbleChart'
import { DonutChart } from './sections/DonutChart'
import { chartData } from "../sample_response"
function App() {
  const [data, setData] = useState(chartData.body[0]);
  const [bubbleChartData, setBubbleChartData] = useState()
  const [payload, setPayload] = useState(null);
  const url = import.meta.env.MODE === 'development' ? 'api/' : 'https://s5c3butdxpd62qaq7g35v26uk40gswlj.lambda-url.us-east-1.on.aws';
  console.log(import.meta.env.MODE, url)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json', // Ensure proper headers are set
          },
        });
        console.log('Response data:', response.data);
        console.log(response.data)
        const result = response.data[0]
        setData(result);
        console.log(result)
        const bubbleData = response.data.flatMap(item =>
          item.lemmatized.map(keyword => ({
            label: keyword.label,
            score: keyword.score,
            keyword: keyword.keyword
          }))
        )
        console.log(bubbleData)
        setBubbleChartData(bubbleData)
      } catch (err) {
        console.error('Network error:', err.message);
        console.error('Error details:', err);
      }
    };

    if (payload) {
      console.log('Payload:', JSON.stringify(payload, null, 2)); // Log the payload being sent
      setTimeout(() => {
        fetchData();
      }, 2000);
    }
  }, [payload]);
  // Trigger fetchData when payload changes

  return (
    <div className='bg-red-50 flex h-screen w-screen'>
      <BubbleChart data={bubbleChartData} classification={data.bias_classification} />
      <DonutChart data={data} payload={payload} setPayload={setPayload} />
    </div>
  );
}

export default App;
