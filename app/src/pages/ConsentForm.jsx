import React, { useEffect, useRef } from 'react';
/**
 * @author Patrick Shaw
 */
function ConsentForm() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const updateIframeHeight = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.style.height = `${window.innerHeight}px`;
      }
    };

    updateIframeHeight();
    window.addEventListener('resize', updateIframeHeight);

    return () => {
      window.removeEventListener('resize', updateIframeHeight);
    };
  }, []);

  return (
    <>
      <div className="pdf-container">
        <iframe
          ref={iframeRef}
          src="/kv60032/app/assets/ParticipantInformationSheet.pdf"
          width="100%"
          title="Consent Form"
        />
      </div>
    </>
  );
}

export default ConsentForm;