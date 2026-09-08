import { Link } from "react-router-dom";
import GitHubIcon from "../icons/GitHubIcon";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-6 py-4 z-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center  justify-center sm:justify-end gap-x-6 gap-y-2 text-sm sm:mr-6 text-white">
        <Link to="/impressum" className="hover:text-gray-200 hover:underline">
          Impressum
        </Link>

        <Link to="/datenschutz" className="hover:text-gray-200 hover:underline">
          Datenschutz
        </Link>

        <a
          href="https://github.com/Yuchan48/audio-transcriber-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-gray-200 hover:underline"
        >
          <GitHubIcon className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
