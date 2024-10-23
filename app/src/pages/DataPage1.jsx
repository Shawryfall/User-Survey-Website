import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
/**
 * @author Patrick Shaw
 */
function DataPage1() {
  const [data, setData] = useState([]);
  const [selectedQ1, setSelectedQ1] = useState('');
  const [selectedGenderID, setSelectedGenderID] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [noData, setNoData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'https://w20012045.nuwebspace.co.uk/kv60032/api/allusersurvey';
        const params = [];
        if (selectedQ1) {
          params.push(`q1=${selectedQ1}`);
        }
        if (selectedGenderID) {
          params.push(`genderID=${selectedGenderID}`);
        }
        if (selectedAge) {
          params.push(`age=${selectedAge}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        const response = await fetch(url);
        if (response.status === 204) {
          setNoData(true);
          setData([]);
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          const data = await response.json();
          setData(data);
          setNoData(false);
        }
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };
    fetchData();
  }, [selectedQ1, selectedGenderID, selectedAge]);

  const getLabelsForQuestion = (questionNumber) => {
    return ['1', '2', '3 (Neutral)', '4', '5'];
  };

  const generateChartData = (questionNumber) => {
    const questionCounts = [0, 0, 0, 0, 0];
    data.forEach((item) => {
      const questionValue = item[`q${questionNumber}`];
      questionCounts[questionValue - 1]++;
    });

    return {
      labels: getLabelsForQuestion(questionNumber),
      datasets: [
        {
          label: `participants`,
          data: questionCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className="text-center my-4">
        <h2 className="text-2xl font-bold my-2">Data</h2>
        <h3 className="text-xl">Bar Charts</h3>
        <h4 className="text-lg my-4">page 1</h4>
        <div className="flex justify-center space-x-4 mt-8 mb-8">
          <button
            className="px-4 text-gray-400 bg-gray-200 border border-gray-300 rounded"
            disabled
          >
            Prev
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate('/datapage2')}
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div>
          <label htmlFor="q1" className="block text-sm font-medium text-gray-700">
            Job Type:
          </label>
          <select
            id="q1"
            value={selectedQ1}
            onChange={(e) => setSelectedQ1(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="accountant">Accountant</option>
            <option value="computing">Computing</option>
            <option value="quantity_surveyor">Quantity Surveyor</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="genderID" className="block text-sm font-medium text-gray-700">
            Gender:
          </label>
          <select
            id="genderID"
            value={selectedGenderID}
            onChange={(e) => setSelectedGenderID(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age:
          </label>
          <select
            id="age"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="18-29">18-29</option>
            <option value="30-44">30-44</option>
            <option value="45-59">45-59</option>
            <option value="60above">60+</option>
          </select>
        </div>
      </div>
      <div className="w-full max-w-lg mx-auto">
        {noData ? (
          <p>No relevant data available.</p>
        ) : (
          [2, 4, 5, 6, 7].map((questionNumber) => (
            <div key={questionNumber} className="mb-8">
              {questionNumber === 2 && (
                <h2 className="text-xl font-bold mb-4">
                  On a scale of 1 to 5, where 1 is "Not true at all" and 5 is "Extremely true," please rate your level of agreement with the following statement: "AI technologies have made my job/study more efficient."
                </h2>
              )}
              {questionNumber === 4 && (
                <h2 className="text-xl font-bold mb-4">
                  How would you rate the level of AI integration in your workplace/study on a scale of 1 to 5, where 1 is "very low" and 5 is "very high"?
                </h2>
              )}
              {questionNumber === 5 && (
                <h2 className="text-xl font-bold mb-4">
                  On a scale of 1 to 5, where 1 is "Very unconcerned" and 5 is "Very concerned," how concerned are you about the potential impact of AI on job security in your industry?
                </h2>
              )}
              {questionNumber === 6 && (
                <h2 className="text-xl font-bold mb-4">
                  Please rate your level of satisfaction with the training and support provided for using AI tools on a scale of 1 to 5, where 1 is "very dissatisfied" and 5 is "very satisfied."
                </h2>
              )}
              {questionNumber === 7 && (
                <h2 className="text-xl font-bold mb-4">
                  On a scale of 1 to 5, where 1 is "Extremely not important" and 5 is "extremely important," how important do you consider the ethical considerations surrounding AI use in the workplace?
                </h2>
              )}
              <div className="h-96">
                <Bar
                  data={generateChartData(questionNumber)}
                  options={{
                    scales: {
                      x: {
                        ticks: {
                          autoSkip: false,
                          maxRotation: 0,
                          minRotation: 0,
                        },
                      },
                      y: {
                        min: 0,
                        max: 8,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="text-center">
        <h4 className="text-lg my-4">page 1</h4>
        <div className="flex justify-center space-x-4 mt-8 mb-8">
          <button className="px-4 text-gray-400 bg-gray-200 border border-gray-300 rounded" disabled>
            Prev
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => {
              navigate('/datapage2');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default DataPage1;