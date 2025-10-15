function RateBar({ rate, count, colorWin = "#0d6efd", colorLoss = "#dc3545" }) {

  const parsedRate = Number(rate);
  const safeRate = !isNaN(parsedRate) ? parsedRate : 0;
  const lossrate = 100 - safeRate;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "3px",
        overflow: "hidden",
        height: "20px",
        maxWidth: "300px",
        fontSize: "0.75rem",
        fontWeight: "bold",
      }}
    >
      {/* Parte blu (vittorie) */}
      <div
        style={{
          width: `${safeRate}%`,
          height: "100%",
          backgroundColor: colorWin,
          transition: "width 0.5s ease",
          float: "left",
        }}
      />

      {/* Parte rossa (sconfitte) */}
      <div
        style={{
          width: `${lossrate}%`,
          height: "100%",
          backgroundColor: colorLoss,
          transition: "width 0.5s ease",
          float: "left",
        }}
      />

      {/* Testo al centro */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
        }}
      >
        {safeRate.toFixed(2)}% {count > 0 ? "(" + count + ")" : null}
      </div>
    </div>
  );
}

export default RateBar;
