import React from "react";

const CreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4 w-full"
    >
      + Create Event
    </button>
  );
};

export default CreateButton;
