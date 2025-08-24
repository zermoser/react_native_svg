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
  height = 220,
  marginHorizontal = 16,
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

  const centerY = Math.round(height / 2 + 8);
  const availableW = Math.max(120, width - marginHorizontal * 2);
  const gap = availableW / Math.max(1, pointsData.length - 1);

  const rBase = Math.max(4, Math.round(width / 160));
  const dotRadius = rBase + 3;
  const strokeWidth = Math.max(2, Math.round(width / 320));
  const fontSize = Math.max(10, Math.round(width / 72));
  const smallFont = Math.max(9, Math.round(fontSize * 0.9));

  const points = pointsData.map((p, i) => ({
    ...p,
    x: marginHorizontal + gap * i,
    y: centerY,
    index: i,
  }));

  // Build a polyline-like path with straight segments (no curves).
  // To create the zigzag, we insert a mid-point between each pair of main points
  // at x = midX and y = centerY +/- amplitude. Then draw straight 'L' segments
  // between points and midpoints, producing sharp peaks instead of smooth curves.
  const pathD = useMemo(() => {
    if (!points.length) return "";
    const baseAmp = Math.max(8, Math.round(width / 120));

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midX = (prev.x + cur.x) / 2;
      const isMajor = !!cur.major;
      const amp = isMajor ? Math.round(baseAmp * 0.6) : baseAmp;
      const dir = i % 2 === 0 ? -1 : 1; // alternate up/down
      const midY = centerY + dir * amp;

      // line from prev to mid (creates straight slanted segment)
      d += ` L ${midX} ${midY}`;
      // line from mid to current (straight back to baseline)
      d += ` L ${cur.x} ${cur.y}`;
    }

    return d;
  }, [points, centerY, width]);

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <View style={[styles.container, { width }]}>
      <Svg width={width} height={height}>
        <SvgText x={width / 2} y={16} fontSize={Math.max(11, Math.round(fontSize * 0.95))} fontWeight="600" textAnchor="middle">
          ความคุ้มครองชีวิต : จำนวนที่มากกว่าระหว่าง 100% ของทุนประกันภัย
        </SvgText>
        <SvgText x={width / 2} y={30} fontSize={Math.max(10, Math.round(smallFont))} textAnchor="middle">
          หรือ มูลค่าเวนคืนเงินสด หรือ เบี้ยประกันภัยสะสม
        </SvgText>

        {/* baseline faint line */}
        <Line x1={points[0].x} y1={centerY} x2={points[points.length - 1].x} y2={centerY} stroke={color} strokeWidth={strokeWidth} opacity={0.2} strokeLinecap="round" />

        {/* straight zigzag path (no curves) */}
        <Path d={pathD} stroke={color} strokeWidth={strokeWidth + 1} fill="none" strokeLinecap="butt" strokeLinejoin="miter" />

        <G>
          {points.map((p) => (
            <G key={p.id}>
              <Circle cx={p.x} cy={p.y} r={dotRadius} fill={dotFill} stroke={color} strokeWidth={2} />

              <Circle cx={p.x} cy={p.y} r={dotRadius * 2.4} fill="transparent" onPress={() => setActiveId((cur) => (cur === p.id ? null : p.id))} />

              {p.note ? (
                <SvgText x={p.x} y={p.y + 22} fontSize={smallFont} textAnchor="middle">
                  {p.note}
                </SvgText>
              ) : p.label ? (
                <SvgText x={p.x} y={p.y + 20} fontSize={smallFont} textAnchor="middle">
                  {p.label}
                </SvgText>
              ) : null}

              {activeId === p.id && (p.value || p.note) ? (
                <G>
                  <Rect x={p.x - 48} y={p.y - 64} rx={6} ry={6} width={96} height={34} fill="#ffffff" stroke={color} strokeWidth={1} opacity={0.98} />
                  <SvgText x={p.x} y={p.y - 44} fontSize={smallFont} fontWeight="700" textAnchor="middle">
                    {p.value ?? p.note?.split("\n")[0]}
                  </SvgText>
                </G>
              ) : null}
            </G>
          ))}
        </G>

        <SvgText x={10} y={centerY} fontSize={Math.max(12, fontSize)} fontWeight="600" transform={`rotate(-90 10 ${centerY})`} textAnchor="middle">
          สิ้นปีกรมธรรม์ที่
        </SvgText>

        {(() => {
          const last = points[points.length - 1];
          if (!last) return null;
          const arrowX = last.x;
          const arrowTopY = 36;
          const arrowBottomY = last.y + 8;

          return (
            <G>
              <Line x1={arrowX} y1={arrowTopY} x2={arrowX} y2={arrowBottomY} stroke={color} strokeWidth={strokeWidth} />
              <Polygon points={`${arrowX - 7},${arrowTopY + 12} ${arrowX + 7},${arrowTopY + 12} ${arrowX},${arrowTopY}`} fill={color} />

              {last.value ? (
                <SvgText x={arrowX} y={arrowTopY - 8} fontSize={Math.max(11, fontSize)} fontWeight="700" textAnchor="middle">
                  {last.value}
                </SvgText>
              ) : null}

              <SvgText x={arrowX} y={arrowBottomY + 26} fontSize={smallFont} textAnchor="middle">
                ชำระเบี้ยครบ
              </SvgText>
            </G>
          );
        })()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    padding: 8,
  },
});