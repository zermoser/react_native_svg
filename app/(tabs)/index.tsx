import React, { useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from "react-native-svg";

type DataPoint = {
  id: string;
  label?: string;
  note?: string;
  major?: boolean;
  value?: string;
};

export default function TimelineChart({
  data,
  height = 280,
  marginHorizontal = 40,
  color = "#2c8592",
  dotFill = "#c9e04a",
}: {
  data?: DataPoint[];
  height?: number;
  marginHorizontal?: number;
  color?: string;
  dotFill?: string;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(980, windowWidth - 24);

  const defaultData: DataPoint[] = useMemo(
    () => [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "5", label: "5" },
      { id: "10", label: "10" },
      { id: "15", label: "15" },
      { id: "20", label: "20" },
      { id: "60", note: "ครบอายุ\n60", major: true },
      { id: "70", note: "ครบอายุ\n70", major: true },
      { id: "80", note: "ครบอายุ\n80", major: true },
      { id: "90", note: "ครบอายุ\n90", major: true, value: "150,000" },
    ],
    []
  );

  const pointsData = data && data.length ? data : defaultData;

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
    const amplitude = 35; // Increased amplitude for more pronounced zigzag

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midX = (prev.x + cur.x) / 2;

      // Alternate direction for each segment to create zigzag
      const direction = i % 2 === 0 ? -1 : 1;
      const midY = centerY + (direction * amplitude);

      // Create sharp zigzag by going to mid point then to current point
      d += ` L ${midX} ${midY}`;
      d += ` L ${cur.x} ${cur.y}`;
    }

    return d;
  }, [points, centerY]);

  const [activeId, setActiveId] = useState<string | null>(null);

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
          ความคุ้มครองชีวิต : จำนวนที่มากกว่าระหว่าง 100% ของทุนประกันภัย
        </SvgText>

        {/* Subtitle */}
        <SvgText
          x={width / 2}
          y={42}
          fontSize={14}
          textAnchor="middle"
          fill="#666"
        >
          หรือ มูลค่าเวนคืนเงินสด หรือ เบี้ยประกันภัยสะสม
        </SvgText>

        {/* Baseline horizontal line */}
        <Line
          x1={points[0].x - 20}
          y1={centerY}
          x2={points[points.length - 1].x + 20}
          y2={centerY}
          stroke={color}
          strokeWidth={2}
          opacity={0.3}
        />

        {/* Zigzag path */}
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
          {points.map((p, index) => (
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

              {/* Labels below points */}
              {p.major && p.note ? (
                <SvgText
                  x={p.x}
                  y={p.y + 30}
                  fontSize={smallFont}
                  textAnchor="middle"
                  fill="#333"
                >
                  {p.note.replace('\n', ' ')}
                </SvgText>
              ) : p.label ? (
                <SvgText
                  x={p.x}
                  y={p.y + 25}
                  fontSize={smallFont}
                  textAnchor="middle"
                  fill="#333"
                >
                  {p.label}
                </SvgText>
              ) : null}

              {/* Tooltip on click */}
              {activeId === p.id && p.value ? (
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
              ) : null}
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
          สิ้นปีกรมธรรม์ที่
        </SvgText>

        {/* Arrow and final value for last point */}
        {(() => {
          const last = points[points.length - 1];
          if (!last || !last.value) return null;

          const arrowX = last.x;
          const arrowStartY = 60;
          const arrowEndY = last.y - 15;

          return (
            <G>
              {/* Vertical arrow line */}
              <Line
                x1={arrowX}
                y1={arrowStartY}
                x2={arrowX}
                y2={arrowEndY}
                stroke={color}
                strokeWidth={3}
              />

              {/* Arrow head pointing down to the point */}
              <Polygon
                points={`${arrowX - 6},${arrowEndY - 8} ${arrowX + 6},${arrowEndY - 8} ${arrowX},${arrowEndY}`}
                fill={color}
              />

              {/* Value above arrow */}
              <SvgText
                x={arrowX}
                y={arrowStartY - 8}
                fontSize={16}
                fontWeight="700"
                textAnchor="middle"
                fill="#333"
              >
                {last.value}
              </SvgText>

              {/* Label below the last point */}
              <SvgText
                x={arrowX}
                y={last.y + 50}
                fontSize={smallFont}
                textAnchor="middle"
                fill="#333"
              >
                ชำระเบี้ยครบ
              </SvgText>
            </G>
          );
        })()}

        {/* Left arrow indicator */}
        <G>
          <Line x1={50} y1={80} x2={150} y2={80} stroke={color} strokeWidth={3} />
          <Polygon points="50,80 65,75 65,85" fill={color} />
        </G>

        {/* Right arrow indicator */}
        <G>
          <Line x1={width - 150} y1={80} x2={width - 50} y2={80} stroke={color} strokeWidth={3} />
          <Polygon points={`${width - 50},80 ${width - 65},75 ${width - 65},85`} fill={color} />
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