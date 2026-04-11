const DeleteButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // prevent row click
        onClick();
      }}
      className={`border border-red-500 text-red-500 px-2 py-1 rounded font-bold text-sm ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100 transition"}`}
      disabled={disabled}
    >
      {disabled ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteButton;
