export default function Sidebar({ user, setView }) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">Audio Transcriber</h1>

      <button
        className="block w-full text-left mb-2"
        onClick={() => setView("dashboard")}
      >
        My Files
      </button>

      {user?.role === "admin" && (
        <>
          <button
            className="block w-full text-left mb-2"
            onClick={() => setView("users")}
          >
            Users
          </button>

          <button
            className="block w-full text-left"
            onClick={() => setView("all-audio")}
          >
            All Audio
          </button>
        </>
      )}
    </div>
  );
}
