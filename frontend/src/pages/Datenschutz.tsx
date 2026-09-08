import { useLocation, useNavigate } from "react-router-dom";
import LeftArrow from "../components/icons/LeftArrow";

const path = ["/dashboard", "/login", "/register", "/impressum"];

const Datenschutz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const backPath = path.includes(from) ? from : "/login";

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <main className="min-h-screen w-full bg-white px-6 py-12 overflow-x-hidden">
      <button
        onClick={handleBack}
        className="mb-10 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <LeftArrow className="h-4 w-4" />
        Back
      </button>

      <div className="mx-auto max-w-3xl text-gray-800">
        <h1 className="mb-10 text-3xl font-bold">Datenschutzerklärung</h1>

        <div className="space-y-10 leading-7">
          {/* 1 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Verantwortlicher</h2>

            <p>
              Verantwortlicher für die Verarbeitung personenbezogener Daten ist
              die im{" "}
              <a href="/impressum" className="underline hover:text-gray-600">
                Impressum
              </a>{" "}
              genannte Person.
            </p>

            <p className="mt-4">
              Bei Fragen zum Datenschutz oder zur Verarbeitung Ihrer
              personenbezogenen Daten können Sie sich über die im Impressum
              angegebenen Kontaktdaten an den Verantwortlichen wenden.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              2. Allgemeine Informationen zur Datenverarbeitung
            </h2>

            <p>
              Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Wir
              verarbeiten personenbezogene Daten nur soweit dies für die
              Bereitstellung, Sicherheit und Nutzung dieser Anwendung
              erforderlich ist oder Sie in eine Verarbeitung eingewilligt haben.
            </p>

            <p className="mt-4">
              Diese Datenschutzerklärung informiert Sie darüber, welche Daten
              verarbeitet werden, zu welchen Zwecken dies geschieht, welche
              externen Dienste eingesetzt werden und welche Rechte Ihnen
              hinsichtlich Ihrer personenbezogenen Daten zustehen.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. Hosting und technische Infrastruktur
            </h2>

            <p>
              Die Anwendung wird auf einem Linux-Server bei Hetzner in
              Deutschland betrieben. Der Server befindet sich am Standort
              Nürnberg.
            </p>

            <p className="mt-4">
              Das Backend der Anwendung sowie die PostgreSQL-Datenbank werden
              auf diesem Server betrieben. Die Anwendung verwendet Docker zur
              Bereitstellung und Ausführung der technischen Komponenten.
            </p>

            <p className="mt-4">
              Im Rahmen des technischen Betriebs können technisch erforderliche
              Informationen verarbeitet werden, die für die Bereitstellung,
              Sicherheit und Stabilität der Anwendung notwendig sind.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              4. Registrierung und Anmeldung
            </h2>

            <p>
              Für die Nutzung bestimmter Funktionen können Sie ein Benutzerkonto
              erstellen. Dabei werden die für die Registrierung und Anmeldung
              erforderlichen Kontodaten verarbeitet.
            </p>

            <p className="mt-4">
              Die Anwendung bietet außerdem die Anmeldung über Google OAuth
              beziehungsweise Google Identity Services an. Bei Verwendung dieser
              Funktion werden die für die Authentifizierung erforderlichen
              Informationen von Google verarbeitet.
            </p>

            <p className="mt-4">
              Die Authentifizierung der Anwendung verwendet ein technisch
              erforderliches Cookie. Dieses Cookie wird mit den
              Sicherheitseinstellungen <code>HttpOnly</code>,{" "}
              <code>Secure</code> und <code>SameSite=Lax</code> verwendet.
            </p>

            <p className="mt-4">
              Das Authentifizierungs-Cookie dient ausschließlich dazu, die
              Anmeldung und die geschützten Funktionen der Anwendung
              bereitzustellen.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              5. Audiodateien und Transkriptionen
            </h2>

            <p>
              Wenn Sie eine Audiodatei zur Transkription hochladen, wird die
              Audiodatei verarbeitet, um daraus eine Texttranskription zu
              erstellen.
            </p>

            <p className="mt-4">
              Die hochgeladene Audiodatei wird zu diesem Zweck an den
              Transkriptionsdienst Deepgram übermittelt. Die Übermittlung
              erfolgt ausschließlich zur Durchführung der Transkription.
            </p>

            <p className="mt-4">
              Die gespeicherten Audiodateien und Transkriptionen werden in der
              PostgreSQL-Datenbank der Anwendung gespeichert.
            </p>

            <p className="mt-4">
              Die Anwendung verwendet die Audiodateien und Transkriptionen
              ausschließlich zur Bereitstellung der von Ihnen angeforderten
              Transkriptionsfunktion und zur Anzeige bzw. Verwaltung Ihrer
              gespeicherten Inhalte.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Löschung von Benutzerkonten und Daten
            </h2>

            <p>
              Sie können Ihr Benutzerkonto löschen. Bei der Löschung werden die
              mit Ihrem Benutzerkonto verbundenen Daten gelöscht.
            </p>

            <p className="mt-4">
              Dies umfasst insbesondere Ihre Anmeldeinformationen, gespeicherte
              Audiodateien und gespeicherte Transkriptionen.
            </p>

            <p className="mt-4">
              Die Anwendung verfügt außerdem über ein Demo-Konto. Da dieses
              Konto von mehreren Personen verwendet werden kann, werden die
              zuvor gespeicherten Audiodateien und Transkriptionen des
              Demo-Kontos beim nächsten Login zurückgesetzt bzw. gelöscht.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              7. Fehlerüberwachung mit Sentry
            </h2>

            <p>
              Zur Überwachung der technischen Stabilität und zur Erkennung von
              Fehlern wird in der Produktionsumgebung Sentry eingesetzt.
            </p>

            <p className="mt-4">
              Sentry erhält ausschließlich die für die technische Fehleranalyse
              erforderlichen Informationen. Personenbezogene Benutzerdaten
              werden von der Anwendung nicht aktiv an Sentry übermittelt.
            </p>

            <p className="mt-4">
              Die an Sentry übermittelten Fehlerdaten werden vor der
              Übermittlung bereinigt. Insbesondere wird keine IP-Adresse erfasst
              oder an Sentry übermittelt.
            </p>

            <p className="mt-4">
              Sentry wird ausschließlich für technische Fehlerüberwachung und
              nicht für Nutzeranalyse oder Werbung eingesetzt.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              8. Analyse mit PostHog
            </h2>

            <p>
              Wir verwenden PostHog zur Analyse der Nutzung der Anwendung und
              zur Verbesserung ihrer Funktionen.
            </p>

            <p className="mt-4">
              PostHog wird nur aktiviert, wenn Sie zuvor Ihre Einwilligung zur
              Verwendung von Analyse-Cookies erteilt haben.
            </p>

            <p className="mt-4">
              Die Anwendung übermittelt dabei ausschließlich definierte
              Ereignisse, beispielsweise dass eine Transkription gestartet,
              abgeschlossen oder abgespielt wurde. Es werden keine Namen,
              E-Mail-Adressen oder andere direkt identifizierende
              Benutzerinformationen an PostHog übermittelt.
            </p>

            <p className="mt-4">
              Die für PostHog verwendete Datenverarbeitung erfolgt innerhalb der
              europäischen Region.
            </p>

            <p className="mt-4">
              Wenn Sie die Analyse-Cookies ablehnen, wird PostHog nicht
              aktiviert und es werden keine PostHog-Analyseereignisse
              verarbeitet.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Cookies</h2>

            <p>
              Die Anwendung verwendet technisch erforderliche Cookies, die für
              die Anmeldung und den Betrieb geschützter Funktionen notwendig
              sind.
            </p>

            <p className="mt-4">
              Darüber hinaus können optionale Analyse-Cookies für PostHog
              verwendet werden. Diese werden nur nach Ihrer vorherigen
              Einwilligung aktiviert.
            </p>

            <p className="mt-4">
              Sie können die Verwendung optionaler Analyse-Cookies ablehnen.
              Eine Ablehnung hat keinen Einfluss auf die Nutzung der für die
              Anmeldung und den Betrieb der Anwendung erforderlichen Funktionen.
            </p>

            <p className="mt-4">
              Ihre Auswahl bezüglich der Analyse-Cookies wird gespeichert, damit
              Ihre Entscheidung bei späteren Besuchen berücksichtigt werden
              kann.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              10. Rechtsgrundlagen der Verarbeitung
            </h2>

            <p>
              Die Verarbeitung personenbezogener Daten erfolgt abhängig vom
              jeweiligen Zweck auf Grundlage der geltenden
              Datenschutzbestimmungen, insbesondere der Datenschutz-
              Grundverordnung (DSGVO).
            </p>

            <p className="mt-4">
              Die Verarbeitung von Daten, die für die Bereitstellung des
              Benutzerkontos und der von Ihnen angeforderten Funktionen
              erforderlich sind, erfolgt insbesondere zur Durchführung des
              Nutzungsverhältnisses.
            </p>

            <p className="mt-4">
              Die Verarbeitung zu Analysezwecken über PostHog erfolgt auf
              Grundlage Ihrer Einwilligung. Diese Einwilligung können Sie
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>

            <p className="mt-4">
              Technisch erforderliche Verarbeitungsvorgänge können unabhängig
              von einer Einwilligung erfolgen, soweit sie für den Betrieb und
              die Sicherheit der Anwendung erforderlich sind.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">11. Speicherdauer</h2>

            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie dies
              für den jeweiligen Zweck erforderlich ist oder gesetzliche
              Aufbewahrungspflichten bestehen.
            </p>

            <p className="mt-4">
              Bei normalen Benutzerkonten werden die mit dem Konto verbundenen
              Daten grundsätzlich so lange gespeichert, bis der Benutzer sein
              Konto löscht.
            </p>

            <p className="mt-4">
              Bei Löschung des Benutzerkontos werden die damit verbundenen
              Anmeldeinformationen, Audiodateien und Transkriptionen gelöscht.
            </p>

            <p className="mt-4">
              Daten des Demo-Kontos werden beim nächsten Login eines anderen
              Benutzers zurückgesetzt bzw. gelöscht.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">12. Ihre Rechte</h2>

            <p>
              Sie haben im Rahmen der gesetzlichen Voraussetzungen insbesondere
              folgende Rechte:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Recht auf Auskunft über die zu Ihrer Person verarbeiteten Daten
              </li>
              <li>
                Recht auf Berichtigung unrichtiger oder unvollständiger Daten
              </li>
              <li>Recht auf Löschung Ihrer personenbezogenen Daten</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Widerspruch gegen bestimmte Verarbeitungen</li>
              <li>
                Recht auf Datenübertragbarkeit, soweit die gesetzlichen
                Voraussetzungen erfüllt sind
              </li>
              <li>
                Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für
                die Zukunft
              </li>
            </ul>

            <p className="mt-4">
              Die Ausübung Ihrer Rechte ist grundsätzlich kostenlos. Zur
              Bearbeitung eines Antrags können geeignete Informationen zur
              Identitätsprüfung erforderlich sein.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              13. Beschwerderecht bei einer Aufsichtsbehörde
            </h2>

            <p>
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren,
              wenn Sie der Ansicht sind, dass die Verarbeitung gegen geltendes
              Datenschutzrecht verstößt.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              14. Keine automatisierte Entscheidungsfindung
            </h2>

            <p>
              Im Rahmen dieser Anwendung findet keine automatisierte
              Entscheidungsfindung einschließlich Profiling statt, die Ihnen
              gegenüber rechtliche Wirkung entfaltet oder Sie in vergleichbarer
              Weise erheblich beeinträchtigt.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              15. Änderungen dieser Datenschutzerklärung
            </h2>

            <p>
              Wir können diese Datenschutzerklärung anpassen, wenn sich die
              technische Umsetzung der Anwendung, die eingesetzten Dienste oder
              die rechtlichen Anforderungen ändern.
            </p>

            <p className="mt-4">
              Es gilt jeweils die zum Zeitpunkt Ihres Besuchs veröffentlichte
              Fassung dieser Datenschutzerklärung.
            </p>
          </section>

          <p className="border-t border-gray-200 pt-6 text-sm text-gray-500">
            Stand: September 2026
          </p>
        </div>
      </div>
    </main>
  );
};

export default Datenschutz;
