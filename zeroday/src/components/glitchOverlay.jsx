const glitchOverlay = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none z-50"
        style={{ mixBlendMode: "screen", opacity: 0.3 }}
        src="/videos/glitch.mp4"
        type="video/mp4"
      />
    </>
  );
};

export default glitchOverlay;
