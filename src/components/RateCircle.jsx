function RateCircle({ rate, count, colorWin = "#0d6efd", colorLoss = "#dc3545", size = 100, strokeWidth = 10 }) {
  const parsedRate = Number(rate);
  const safeRate = !isNaN(parsedRate) ? parsedRate : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeRate / 100) * circumference;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8rem",
        fontWeight: "bold",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Cerchio base (sconfitte) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colorLoss}
          strokeWidth={strokeWidth}
        />

        {/* Cerchio vittorie (parte blu) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colorWin}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>

      {/* Testo centrale */}
      <div
        style={{
          position: "absolute",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div>{safeRate.toFixed(1)}%</div>
        {count > 0 && <div style={{ fontSize: "0.7rem" }}>({count})</div>}
      </div>
    </div>
  );
}

export default RateCircle;
