import { useNavigate, useLocation } from "react-router-dom";

import LeftArrow from "../components/icons/LeftArrow";

const path = ["/dashboard", "/login", "/register", "/datenschutz"];

const Impressum = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;

  const backPath = path.includes(from) ? from : "/login";

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <main className="min-h-screen max-w-screen w-full bg-white px-6 py-12 overflow-x-hidden">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-500 mb-6"
      >
        <LeftArrow className="h-4 w-4" />
        Back
      </button>
      <div className="mx-auto max-w-3xl text-gray-800">
        <h1 className="text-4xl font-bold mb-10">Impressum</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 DDG</h2>

          <p className="leading-8">
            Yu Iizuka
            <br />
            Borner Str. 15
            <br />
            13051 Berlin
            <br />
            Deutschland
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>

          <p className="leading-8">
            Telefon: +49 152 2372 1160
            <br />
            E-Mail:{" "}
            <a
              href="mailto:yuchan.iizuka@gmail.com"
              className="text-blue-700 hover:underline"
            >
              yuchan.iizuka@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Zweck der Website</h2>

          <p className="leading-8">
            Diese Website dient als persönliches Bewerbungsportfolio und zur
            Bereitstellung einer technischen Arbeitsprobe. Die Website umfasst
            unter anderem eine Audio-Transkriptionsanwendung, mit der
            registrierte Nutzer Audiodateien hochladen und Transkriptionen
            erstellen können.
          </p>

          <p className="leading-8">
            Die Anwendung dient insbesondere der Demonstration von
            Softwareentwicklungs-, Webentwicklungs- und Infrastrukturkenntnissen
            und ist nicht als kommerzielles Angebot gedacht.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Urheberrecht</h2>

          <p className="leading-8">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Impressum;
