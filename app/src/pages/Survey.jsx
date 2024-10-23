import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
/**
 * @author Patrick Shaw
 */
function Survey() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState(0);
  const [q5, setQ5] = useState(0);
  const [q6, setQ6] = useState(0);
  const [q7, setQ7] = useState(0);
  const { state } = useAuthContext();

  useEffect(() => {
    if (state.signedIn) {
      fetchSurveyData();
    }
  }, [state.signedIn]);

  const fetchSurveyData = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/specificusersurvey', { headers: headers })
      .then(response => {
        if (response.status === 204) {
          setQ1('');
          setQ2(0);
          setQ3('');
          setQ4(0);
          setQ5(0);
          setQ6(0);
          setQ7(0);
          return null;
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data !== null) {
          const flattenedData = data.map(survey => ({
            q1: survey.q1 || '',
            q2: parseInt(survey.q2) || 0,
            q3: survey.q3 || '',
            q4: parseInt(survey.q4) || 0,
            q5: parseInt(survey.q5) || 0,
            q6: parseInt(survey.q6) || 0,
            q7: parseInt(survey.q7) || 0,
          }));
          setQ1(flattenedData[0].q1);
          setQ2(flattenedData[0].q2);
          setQ3(flattenedData[0].q3);
          setQ4(flattenedData[0].q4);
          setQ5(flattenedData[0].q5);
          setQ6(flattenedData[0].q6);
          setQ7(flattenedData[0].q7);
        }
      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });
  };

  const handleQ1Change = (e) => {
    setQ1(e.target.value);
  };

  const handleQ2Change = (e) => {
    setQ2(parseInt(e.target.value));
  };

  const handleQ3Change = (e) => {
    setQ3(e.target.value.slice(0, 200));
  };

  const handleQ4Change = (e) => {
    setQ4(parseInt(e.target.value));
  };

  const handleQ5Change = (e) => {
    setQ5(parseInt(e.target.value));
  };

  const handleQ6Change = (e) => {
    setQ6(parseInt(e.target.value));
  };

  const handleQ7Change = (e) => {
    setQ7(parseInt(e.target.value));
  };

  const saveSurvey = () => {
    if (!q1 || !q2 || !q4 || !q5 || !q6 || !q7) {
      toast.error('Please complete all the required fields!');
      return;
    }

    const surveyData = {
      q1: q1,
      q2: q2,
      q3: q3 || null,
      q4: q4,
      q5: q5,
      q6: q6,
      q7: q7,
    };

    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/specificusersurvey', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(surveyData),
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          toast.success('Survey saved successfully!');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Failed to save the survey!');
      });
  };

  const deleteSurvey = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    fetch('https://w20012045.nuwebspace.co.uk/kv60032/api/specificusersurvey', {
      method: 'DELETE',
      headers: headers,
    })
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          toast.success('Survey deleted successfully!');
          setQ1('');
          setQ2(0);
          setQ3('');
          setQ4(0);
          setQ5(0);
          setQ6(0);
          setQ7(0);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error('Failed to delete the survey!');
      });
  };

  return (
    <>
      <div className="my-4 px-4">
        <h2 className="text-2xl font-bold my-2 text-center">Survey</h2>
        {state.signedIn ? (
          <div className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="q1" className="block mb-2">(1.) What is your current job title/field:</label>
              <select
                id="q1"
                className="border border-gray-300 px-2 py-1 rounded w-full"
                value={q1}
                onChange={handleQ1Change}
              >
                <option value="">Select an option</option>
                <option value="accountant">Accountant</option>
                <option value="computing">Computing</option>
                <option value="quantity_surveyor">Quantity Surveyor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">(2.) On a scale of 1 to 5, where 1 is "Not true at all" and 5 is "Extremely true," please rate your level of agreement with the following statement: "AI technologies have made my job/study more efficient.":</label>
              <div className="flex flex-col">
                {[
                  { value: 1, label: "1. Not true at all" },
                  { value: 2, label: "2. Slightly true" },
                  { value: 3, label: "3. Neutral" },
                  { value: 4, label: "4. Very true" },
                  { value: 5, label: "5. Extremely true" }
                ].map(({ value, label }) => (
                  <div key={value} className="mb-2">
                    <label htmlFor={`q2-${value}`} className="inline-flex items-center">
                      <input
                        type="radio"
                        id={`q2-${value}`}
                        name="q2"
                        value={value}
                        checked={q2 === value}
                        onChange={handleQ2Change}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="q3" className="block mb-2">(3.) In 200 characters, please share your thoughts and opinions regarding using AI technologies in the workplace and study. (Optional):</label>
              <textarea
                id="q3"
                className="border border-gray-300 px-2 py-1 rounded w-full h-24"
                value={q3}
                onChange={handleQ3Change}
                maxLength={200}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">(4.) How would you rate the level of AI integration in your workplace/study on a scale of 1 to 5, where 1 is "very low" and 5 is "very high"?:</label>
              <div className="flex flex-col">
                {[
                  { value: 1, label: "1. Very low" },
                  { value: 2, label: "2. Low" },
                  { value: 3, label: "3. Neutral" },
                  { value: 4, label: "4. High" },
                  { value: 5, label: "5. Very high" }
                ].map(({ value, label }) => (
                  <div key={value} className="mb-2">
                    <label htmlFor={`q4-${value}`} className="inline-flex items-center">
                      <input
                        type="radio"
                        id={`q4-${value}`}
                        name="q4"
                        value={value}
                        checked={q4 === value}
                        onChange={handleQ4Change}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">(5.) On a scale of 1 to 5, where 1 is "Very unconcerned" and 5 is "Very concerned," how concerned are you about the potential impact of AI on job security in your industry?:</label>
              <div className="flex flex-col">
                {[
                  { value: 1, label: "1. Very unconcerned" },
                  { value: 2, label: "2. Slightly unconcerned" },
                  { value: 3, label: "3. Neutral" },
                  { value: 4, label: "4. Slightly concerned" },
                  { value: 5, label: "5. Very concerned" }
                ].map(({ value, label }) => (
                  <div key={value} className="mb-2">
                    <label htmlFor={`q5-${value}`} className="inline-flex items-center">
                      <input
                        type="radio"
                        id={`q5-${value}`}
                        name="q5"
                        value={value}
                        checked={q5 === value}
                        onChange={handleQ5Change}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">(6.) Please rate your level of satisfaction with the training and support provided for using AI tools on a scale of 1 to 5, where 1 is "very dissatisfied" and 5 is "very satisfied.":</label>
              <div className="flex flex-col">
                {[
                  { value: 1, label: "1. Very dissatisfied" },
                  { value: 2, label: "2. Dissatisfied" },
                  { value: 3, label: "3. Neutral" },
                  { value: 4, label: "4. Satisfied" },
                  { value: 5, label: "5. Very satisfied" }
                ].map(({ value, label }) => (
                  <div key={value} className="mb-2">
                    <label htmlFor={`q6-${value}`} className="inline-flex items-center">
                      <input
                        type="radio"
                        id={`q6-${value}`}
                        name="q6"
                        value={value}
                        checked={q6 === value}
                        onChange={handleQ6Change}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">(7.) On a scale of 1 to 5, where 1 is "Extremely not important" and 5 is "extremely important," how important do you consider the ethical considerations surrounding AI use in the workplace?:</label>
              <div className="flex flex-col">
                {[
                  { value: 1, label: "1. Extremely not important" },
                  { value: 2, label: "2. Slightly not important" },
                  { value: 3, label: "3. Neutral" },
                  { value: 4, label: "4. Slightly important" },
                  { value: 5, label: "5. Extremely important" }
                ].map(({ value, label }) => (
                  <div key={value} className="mb-2">
                    <label htmlFor={`q7-${value}`} className="inline-flex items-center">
                      <input
                        type="radio"
                        id={`q7-${value}`}
                        name="q7"
                        value={value}
                        checked={q7 === value}
                        onChange={handleQ7Change}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out mr-2"

                onClick={saveSurvey}
              >
                Save Survey
              </button>
              <button
                className="px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200 ease-in-out mr-2"
                onClick={deleteSurvey}
              >
                Delete Survey
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center">You need to be signed in to complete the survey.</p>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default Survey;