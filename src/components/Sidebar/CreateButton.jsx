import React from "react";

const CreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 flex items-center justify-center 
                 bg-blue-600 hover:bg-blue-700 
                 text-white text-xl font-bold 
                 rounded-md border border-blue-800 shadow-sm 
                 transition-all duration-200"
      title="Create Event"
    >
      +
    </button>
  );
};

export default CreateButton;
