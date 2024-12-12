import axios from 'axios';
import { useState, useEffect } from 'react';
import { BubbleChart } from './sections/BubbleChart'
import { DonutChart } from './sections/DonutChart'
import { chartData } from "../sample_response"
function App() {
  const [data, setData] = useState(chartData.body[0]);
  const [bubbleChartData, setBubbleChartData] = useState()
  const [payload, setPayload] = useState(null);
  const [isStatic, setIsStatic] = useState(true);
  const url = import.meta.env.MODE === 'development' ? 'api/' : 'https://saei4yhgnxaxqtdhgyym3mzo3m0kdhaa.lambda-url.us-east-1.on.aws/';
  const bubbleUrl = 'https://saei4yhgnxaxqtdhgyym3mzo3m0kdhaa.lambda-url.us-east-1.on.aws/'

  useEffect(() => {
    const fetchChartData = async () => {
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
        setIsStatic(false)
        console.log(result)

      } catch (err) {
        console.error('Network error:', err.message);
        console.error('Error details:', err);
      }
    };
    const fetchBubbleData = async () => {
      try {
        const response = await axios.post(bubbleUrl, payload, {
          headers: {
            'Content-Type': 'application/json', // Ensure proper headers are set
          },
        });
        console.log('Response data:', response.data);
        console.log(response.data)

      } catch (err) {
        console.error('Network error:', err.message);
        console.error('Error details:', err);
      }
    };

    if (payload) {
      console.log('Payload:', JSON.stringify(payload, null, 2)); // Log the payload being sent
      setTimeout(() => {
        fetchChartData();
        fetchBubbleData();
      }, 2000);
    }
  }, [payload]);
  // Trigger fetchData when payload changes

  return (
    <div className='bg-red-50 flex h-screen w-screen'>
      {data && <BubbleChart data={data} classification={data.bias_classification} />}
      <DonutChart isStatic={isStatic} data={data} payload={payload} setPayload={setPayload} />
    </div>
  );
}

export default App;
