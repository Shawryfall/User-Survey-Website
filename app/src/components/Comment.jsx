import { useState, useEffect } from 'react';
/**
 * @author Patrick Shaw
 */
function Comment() {
  const [comment, setComment] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("https://w20012045.nuwebspace.co.uk/kv60032/api/preview?limit=1")
        .then(response => {
          return response.status === 200 ? response.json() : [];
        })
        .then(json => {
          setComment(json);
        })
        .catch(err => {
          console.log(err.message);
        });
    };

    const interval = setInterval(fetchData, 10000);
    fetchData();

    return () => clearInterval(interval);
  }, []);

  const commentJSX = comment.map((comment, i) => (
    <section key={i} className="bg-white shadow-md rounded-lg p-4 mb-4 h-32 flex items-center">
      <p className="text-lg font-semibold mb-2">
        <span className="mr-2">"</span>
        {comment.q3}
        <span className="ml-2">"</span>
      </p>
    </section>
  ));

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md max-w-xl mx-auto my-4">
      {commentJSX}
    </div>
  );
}

export default Comment;