import CookieConsent from "react-cookie-consent";

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="audioTranscriberCookieConsent"
      expires={90}
      sameSite="lax"
      onAccept={() => {
        window.location.reload();
      }}
      onDecline={() => {
        window.location.reload();
      }}
      containerClasses="!bg-white !text-gray-700 !shadow-2xl !rounded-xl !max-w-2xl !w-[calc(100%-2rem)] !left-1/2 !-translate-x-1/2 !bottom-4 !mb-0 !px-6 !py-4"
      contentClasses="!m-0 !p-0 !text-sm !leading-5"
      buttonWrapperClasses="!flex !h-full !items-center !justify-end !ml-auto !mt-2 !gap-2"
      buttonClasses="!bg-gray-900 !text-white !rounded-lg !px-4 !py-2 !text-sm !font-medium !m-0 hover:!bg-gray-700"
      declineButtonClasses="!bg-gray-100 !text-gray-700 !rounded-lg !px-4 !py-2 !text-sm !font-medium !m-0 hover:!bg-gray-200"
    >
      <div className="flex flex-col gap-1">
        <p>We use analytics cookies to understand how this app is used.</p>

        <a
          href="/datenschutz"
          className="text-sm text-gray-500 underline hover:text-gray-900"
        >
          Privacy Policy
        </a>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentBanner;
