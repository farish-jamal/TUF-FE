import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const token = localStorage.getItem("token");

  const handleGetAllQUestion = async () => {
    try {
      const response = await axios.get(
        "https://tuf-be.onrender.com/api/flashcards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        toast.error('Error while fetching cards');
        return;
      }
      setQuestions(response.data.data)
    } catch (error) {
      toast.error('Internal server error');
      console.log(error);
    }
  };

  const handleAdd = async () => {
    try {
      const toastId = toast.loading("Adding Card");
      const response = await axios.post(
        "https://tuf-be.onrender.com/api/flashcards",
        {
          question: newQuestion,
          answer: newAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 201) {
        toast.dismiss(toastId);
        toast.error('Error while adding card');
      }
      toast.dismiss(toastId);
      toast.success("Flashcard added successfully!");
      setNewQuestion("");
      setNewAnswer("");
      setShowNewQuestion(!showNewQuestion);
    } catch (error) {
      toast.error('Internal Server Error');
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    const question = questions.find((q) => q.id === id);
    setEditing(id);
    setEditQuestion(question.question);
    setEditAnswer(question.answer);
  };

  const handleSave = async() => {
    try {
      const toastId = toast.loading("Updating card...");
      const response = await axios.put(
        `https://tuf-be.onrender.com/api/flashcards/${editing}`,
        {
          question: editQuestion,
          answer: editAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        toast.error('Error while updating card');
        toast.dismiss(toastId);
        return;
      }
      toast.dismiss(toastId);
      toast.success('Flashcard updated successfully!');
      setShowNewQuestion(!showNewQuestion);
      setEditing(null);
    } catch (error) {
      toast.error('Internal server error');
      console.log(error);
    }
  };

  const handleDelete = async(id) => {
    try {
      const toastId = toast.loading("Deleting card...");
      const response = await axios.delete(
        `https://tuf-be.onrender.com/api/flashcards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        toast.dismiss(toastId);
        toast.error('Failed to delete flashcard.');
      }
      toast.dismiss(toastId);
      toast.success('Flashcard deleted successfully!');
      setShowNewQuestion(!showNewQuestion);
    } catch (error) {
      toast.error('Internal server error');
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllQUestion();
  }, [showNewQuestion])
  

  return (
    <>
      <Toaster duration="4000" position="top-right" />
      <div className="relative min-h-screen bg-gray-50 p-6">
        <Link
          to="/"
          className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Back to Homepage
        </Link>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Dashboard
          </h2>

          {/* Add New Question */}
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Add New Question
            </h3>
            <input
              type="text"
              placeholder="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            />
            <input
              type="text"
              placeholder="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <button
              onClick={handleAdd}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>

          {/* List of Questions */}
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Questions List
            </h3>
            {questions.length === 0 ? (
              <p className="text-gray-600">No questions added yet.</p>
            ) : (
              questions.map(({ id, question, answer }) => (
                <div
                  key={id}
                  className="mb-4 p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    {question}
                  </h4>
                  <p className="text-gray-700 mb-4">{answer}</p>
                  <button
                    onClick={() => handleEdit(id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        {editing && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Edit Question
              </h3>
              <input
                type="text"
                placeholder="Question"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
              />
              <input
                type="text"
                placeholder="Answer"
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
