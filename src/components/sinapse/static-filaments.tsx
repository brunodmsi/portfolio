/** Code-native linework is also the complete no-WebGL artwork. */
export function StaticFilaments() {
  return (
    <svg className="static-filaments" viewBox="0 0 1440 1000" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="filament-metal" x1="80" y1="800" x2="1350" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0b542d" />
          <stop offset=".32" stopColor="#22c55e" />
          <stop offset=".5" stopColor="#c5e8d8" />
          <stop offset=".62" stopColor="#436c70" />
          <stop offset=".76" stopColor="#69e2b6" />
          <stop offset="1" stopColor="#152e31" />
        </linearGradient>
      </defs>
      {Array.from({ length: 44 }, (_, i) => {
        const offset = (i - 22) * 4.8;
        const spread = Math.sin(i * 1.17) * 48;
        return <path key={i} d={`M -160 ${940 + offset} C 100 ${840 + offset}, 270 ${770 + spread}, 540 ${480 + offset} C ${850 + spread} ${80 + offset}, ${1310 + offset} ${165 + spread}, ${1150 + offset} ${465 + offset} C ${1020 + offset} ${710 + spread}, ${720 + offset} ${480 + offset}, ${935 + spread} ${230 + offset} C ${1060 + offset} ${90 + offset}, 1260 ${125 + offset}, 1580 ${-90 + offset}`} stroke="url(#filament-metal)" strokeWidth={i % 7 === 0 ? 2.5 : 1} opacity={i % 7 === 0 ? .88 : .24 + (i % 5) * .1} />;
      })}
    </svg>
  );
}
