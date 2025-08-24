import React, { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";

type DataPoint = {
  id: string;
  label?: string;
  major?: boolean;
  value?: string;
  year?: string;
  level?: number;
  amountLabel?: string;
  lastPayment?: boolean;
  next?: number;
  divideSa?: boolean;
};

type TimelineChartProps = {
  data?: DataPoint[];
  height?: number;
  marginHorizontal?: number;
  color?: string;
  dotFill?: string;
  lang?: "th" | "en";
};

export default function TimelineChart({
  data,
  height = 280,
  marginHorizontal = 40,
  color = "#2c8592",
  dotFill = "#c9e04a",
  lang = "th",
}: TimelineChartProps) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(980, windowWidth - 24);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Mockup data based on the original code
  const defaultData: DataPoint[] = useMemo(
    () => [
      { id: "1", label: "1", year: "1", next: 1 },
      { id: "2", label: "2", year: "2", next: 1 },
      { id: "5", label: "5", year: "5", next: 1 },
      { id: "10", label: "10", year: "10", next: 1 },
      { id: "15", label: "15", year: "15", next: 1 },
      { id: "20", label: "20", year: "20", next: 1 },
      { id: "60", major: true, year: "A60", next: 1 },
      { id: "70", major: true, year: "A70", next: 1 },
      { id: "80", major: true, year: "A80", next: 1 },
      { id: "90", major: true, value: "150,000", year: "A90", next: 1, lastPayment: true },
    ],
    []
  );

  const pointsData = data && data.length ? data : defaultData;

  // Text content based on language
  const textContent = {
    xAxisLabel: { th: "สิ้นปีกรมธรรม์ที่", en: "End of Year" }[lang],
    premiumEnd: { th: "ชำระเบี้ยครบ", en: "Premium Payment Finished" }[lang],
    atAge: { th: "ครบอายุ", en: "At age" }[lang],
    coverage: {
      th: "ความคุ้มครองชีวิต : จำนวนที่มากกว่าระหว่าง 100% ของทุนประกันภัย",
      en: "Death coverage*"
    }[lang],
    or: {
      th: "หรือ มูลค่าเวนคืนเงินสด หรือ เบี้ยประกันภัยสะสม",
      en: "or Cash Value or Accumulated Premium"
    }[lang],
  };

  const centerY = Math.round(height / 2 + 20);
  const availableW = Math.max(200, width - marginHorizontal * 2);
  const gap = availableW / Math.max(1, pointsData.length - 1);

  const dotRadius = 8;
  const strokeWidth = 3;
  const fontSize = 14;
  const smallFont = 12;

  const points = pointsData.map((p, i) => ({
    ...p,
    x: marginHorizontal + gap * i,
    y: centerY,
    index: i,
  }));

  // Create pronounced zigzag path
  const pathD = useMemo(() => {
    if (!points.length) return "";
    const baseY = centerY;
    const maxAmplitude = Math.min(20, gap * 0.4); // สูงสุด zigzag
    let d = `M ${points[0].x} ${baseY}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const x0 = prev.x;
      const x1 = cur.x;
      const segmentLength = x1 - x0;

      if (i !== 4 && i !== 5 && i !== 7) {
        d += ` L ${x1} ${baseY}`;
        continue;
      }

      // ความยาวเส้นตรงเริ่มและจบของ segment เท่ากัน
      const straightLength = Math.min(maxAmplitude, segmentLength / 6);

      // ความกว้าง zigzag (แบ่งเหลือจากเส้นตรงเริ่ม-จบ)
      const zigzagWidth = segmentLength - 2 * straightLength;
      const ampX = zigzagWidth / 6; // 3 peaks (ขึ้น-ลง-ขึ้น)
      const ampY = ampX; // 45°

      // จุด zigzag
      const p1 = x0 + straightLength + 10;
      const peakX = p1 + ampX;
      const p2 = peakX + ampX;
      const troughX = p2 + ampX;
      const p3 = troughX + ampX;
      const finalX = x1 - straightLength - 10;

      const peakY = baseY - ampY;
      const troughY = baseY + ampY;

      // วาด path
      d += ` L ${p1} ${baseY}`;        // เส้นตรงเริ่ม
      d += ` L ${peakX} ${peakY}`;     // ขึ้นเฉียง
      d += ` L ${p2} ${baseY}`;        // กลาง
      d += ` L ${troughX} ${troughY}`; // ลงเฉียง
      d += ` L ${p3} ${baseY}`;        // กลาง
      d += ` L ${finalX} ${baseY}`;    // เส้นตรงสุดท้าย
      d += ` L ${x1} ${baseY}`;        // ปิด segment
    }

    return d;
  }, [points, centerY, gap]);

  // Find the last payment point
  const lastPaymentPoint = points.find(p => p.lastPayment);

  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height={height}>
        {/* Main Title */}
        <SvgText
          x={width / 2}
          y={25}
          fontSize={16}
          fontWeight="600"
          textAnchor="middle"
          fill="#333"
        >
          {textContent.coverage}
        </SvgText>

        {/* Subtitle */}
        <SvgText
          x={width / 2}
          y={42}
          fontSize={14}
          textAnchor="middle"
          fill="#666"
        >
          {textContent.or}
        </SvgText>

        {/* Mixed path: straight lines + zigzag */}
        <Path
          d={pathD}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points and labels */}
        <G>
          {points.map((p) => (
            <G key={p.id}>
              {/* Data point circle */}
              <Circle
                cx={p.x}
                cy={p.y}
                r={dotRadius}
                fill={dotFill}
                stroke={color}
                strokeWidth={2}
              />

              {/* Clickable area */}
              <Circle
                cx={p.x}
                cy={p.y}
                r={dotRadius * 2}
                fill="transparent"
                onPress={() => setActiveId((cur) => (cur === p.id ? null : p.id))}
              />

              {/* Year labels below points */}
              <SvgText
                x={p.x}
                y={p.year?.includes('A') ? p.y + 40 : p.y + 25}
                fontSize={smallFont}
                textAnchor="middle"
                fill="#333"
              >
                {p.year?.replace('A', '')}
              </SvgText>

              {/* Age labels for major points */}
              {p.year?.includes('A') && (
                <SvgText
                  x={p.x}
                  y={p.y + 25}
                  fontSize={smallFont - 2}
                  textAnchor="middle"
                  fill="#333"
                >
                  {textContent.atAge}
                </SvgText>
              )}

              {/* Notes for major points */}
              {p.major && (
                <SvgText
                  x={p.x}
                  y={p.y - 30}
                  fontSize={smallFont}
                  textAnchor="middle"
                  fill="#333"
                />
              )}

              {/* Amount labels for points with level */}
              {p.level !== undefined && p.level >= 0 && p.amountLabel && (
                <SvgText
                  x={p.x}
                  y={p.y - 40 - (p.level * 20)}
                  fontSize={smallFont}
                  fontWeight="700"
                  textAnchor="middle"
                  fill="#333"
                >
                  {p.amountLabel}
                </SvgText>
              )}

              {/* Tooltip on click */}
              {activeId === p.id && p.value && (
                <G>
                  <Rect
                    x={p.x - 40}
                    y={p.y - 50}
                    rx={6}
                    ry={6}
                    width={80}
                    height={30}
                    fill="#ffffff"
                    stroke={color}
                    strokeWidth={1}
                    opacity={0.98}
                  />
                  <SvgText
                    x={p.x}
                    y={p.y - 32}
                    fontSize={smallFont}
                    fontWeight="700"
                    textAnchor="middle"
                    fill="#333"
                  >
                    {p.value}
                  </SvgText>
                </G>
              )}
            </G>
          ))}
        </G>

        {/* Y-axis label */}
        <SvgText
          x={15}
          y={centerY}
          fontSize={fontSize}
          fontWeight="600"
          transform={`rotate(-90 15 ${centerY})`}
          textAnchor="middle"
          fill="#333"
        >
          {textContent.xAxisLabel}
        </SvgText>

        {/* Arrow and final value for last point */}
        {lastPaymentPoint && lastPaymentPoint.value && (
          <G>
            {/* Vertical arrow line */}
            <Line
              x1={lastPaymentPoint.x}
              y1={60}
              x2={lastPaymentPoint.x}
              y2={lastPaymentPoint.y - 20}
              stroke={color}
              strokeWidth={3}
            />

            {/* Arrow head pointing down to the point */}
            <Polygon
              points={`${lastPaymentPoint.x - 6},${lastPaymentPoint.y - 23} ${lastPaymentPoint.x + 6},${lastPaymentPoint.y - 23} ${lastPaymentPoint.x},${lastPaymentPoint.y - 15}`}
              fill={"#1b1b1bff"}
            />

            {/* Value above arrow */}
            <SvgText
              x={lastPaymentPoint.x}
              y={52}
              fontSize={16}
              fontWeight="700"
              textAnchor="middle"
              fill="#333"
            >
              {lastPaymentPoint.value}
            </SvgText>

            {/* Label below the last point */}
            <SvgText
              x={lastPaymentPoint.x}
              y={lastPaymentPoint.y + 60}
              fontSize={smallFont}
              textAnchor="middle"
              fill="#333"
            >
              {textContent.premiumEnd}
            </SvgText>
          </G>
        )}

        {/* Left arrow indicator */}
        <G>
          <Line x1={60} y1={80} x2={150} y2={80} stroke={color} strokeWidth={3} />
          <Polygon points="50,80 65,75 65,85" fill={"#1b1b1bff"} />
        </G>

        {/* Right arrow indicator */}
        <G>
          <Line x1={width - 150} y1={80} x2={width - 60} y2={80} stroke={color} strokeWidth={3} />
          <Polygon points={`${width - 50},80 ${width - 65},75 ${width - 65},85`} fill={"#1b1b1bff"} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
});