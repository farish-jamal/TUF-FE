import axios from "axios";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flip, setFlip] = useState(false);
  const token = localStorage.getItem("token");

  const nextCard = () => {
    if (flip) setFlip(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    if (flip) setFlip(false);
    setCurrentCard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleFlip = () => {
    setFlip(!flip);
  };

  const handleGetAllCards = async () => {
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
      setFlashcards(response.data.data)
    } catch (error) {
      toast.error('Internal server error');
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetAllCards();
  }, [])

  return (
    <>
    <Toaster duration="4000" position="top-right" />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 relative">
      <Link to="/dashboard" className="absolute top-4 right-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
        Go to admin panel
      </Link>
      {flashcards.length > 0 && <div>
        <div
          className={`w-72 h-44 transition-transform duration-500 cursor-pointer ${
            flip ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
        >
          <div
            className={`w-full h-full bg-white text-gray-900 flex items-center justify-center rounded-lg shadow-lg ${
              flip ? "hidden" : "block"
            }`}
          >
            <p className="text-base text-center px-4">
              {flashcards[currentCard].question}
            </p>
          </div>
          <div
            className={`w-full h-full bg-white text-gray-900 flex items-center justify-center rounded-lg shadow-lg transform ${
              flip ? "block" : "hidden"
            }`}
          >
            <p className="text-base text-center px-4 rotate-y-0">
              {flashcards[currentCard].answer}
            </p>
          </div>
        </div>
      </div>}
      <div className="flex mt-8 space-x-2">
        <button
          onClick={prevCard}
          className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          onClick={nextCard}
          className="flex items-center px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
    </>
  );
};

export default Flashcards;
