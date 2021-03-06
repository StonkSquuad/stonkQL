import { AxisLeft } from '@visx/axis';
import { curveLinear } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { AppleStock } from '@visx/mock-data/lib/mocks/appleStock';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line } from '@visx/shape';
import {
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
  withTooltip,
} from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector, extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import React, { useCallback, useMemo } from 'react';
import styles from './area.module.scss';

type TooltipData = AppleStock;

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d) => new Date(d.date);
const getStockValue = (d) => d.close;
const bisectDate = bisector<Date>((d) => new Date(d.date)).left;

export type AreaProps = {
  data: { close: number; date: string }[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  axis?: boolean;
  tooltipVisible?: boolean;
};

export const AreaChart = withTooltip<AreaProps, TooltipData>(
  ({
    data,
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 40 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    axis,
    tooltipVisible,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (data) {
      if (width < 10) return null;

      if (!axis) {
        margin.left = 0;
      }

      // bounds
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // scales
      const dateScale = useMemo(
        () =>
          scaleTime({
            range: [margin.left, innerWidth + margin.left],
            domain: extent(data, getDate) as [Date, Date],
          }),
        [data, innerWidth, margin.left]
      );
      const stockValueScale = useMemo(
        () =>
          scaleLinear({
            range: [innerHeight + margin.top, margin.top],
            domain: [0, (max(data, getStockValue) || 0) + innerHeight / 3],
            nice: true,
          }),
        [innerHeight, margin.top, data]
      );

      // tooltip handler
      const handleTooltip = useCallback(
        (
          event:
            | React.TouchEvent<SVGRectElement>
            | React.MouseEvent<SVGRectElement>
        ) => {
          const { x } = localPoint(event) || { x: 0 };
          const x0 = dateScale.invert(x);
          const index = bisectDate(data, x0, 1);
          const d0 = data[index - 1];
          const d1 = data[index];
          let d = d0;
          if (d1 && getDate(d1)) {
            d =
              x0.valueOf() - getDate(d0).valueOf() >
              getDate(d1).valueOf() - x0.valueOf()
                ? d1
                : d0;
          }
          showTooltip({
            tooltipData: d,
            tooltipLeft: x,
            tooltipTop: stockValueScale(getStockValue(d)),
          });
        },
        [dateScale, data, showTooltip, stockValueScale]
      );

      return (
        <div className={styles.area}>
          <svg width={width} height={height}>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="url(#area-background-gradient)"
              rx={10}
            />
            <LinearGradient
              id="area-background-gradient"
              from={background}
              to={background2}
            />
            <LinearGradient
              id="area-gradient"
              from={accentColor}
              to={accentColor}
              toOpacity={0.1}
            />
            <GridRows
              left={margin.left}
              scale={stockValueScale}
              width={innerWidth}
              strokeDasharray="1,3"
              stroke={accentColor}
              strokeOpacity={0}
              pointerEvents="none"
            />
            <GridColumns
              top={margin.top}
              scale={dateScale}
              height={innerHeight}
              strokeDasharray="1,3"
              stroke={accentColor}
              strokeOpacity={0.2}
              pointerEvents="none"
            />
            <AreaClosed
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => stockValueScale(getStockValue(d)) ?? 0}
              yScale={stockValueScale}
              strokeWidth={1}
              stroke="url(#area-gradient)"
              fill="url(#area-gradient)"
              curve={curveLinear}
            />
            <Bar
              x={margin.left}
              y={margin.top}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              rx={10}
              onTouchStart={handleTooltip}
              onTouchMove={handleTooltip}
              onMouseMove={handleTooltip}
              onMouseLeave={() => hideTooltip()}
            />
            {axis && (
              <AxisLeft
                scale={stockValueScale}
                top={10}
                left={margin.left}
                stroke="#fff"
                tickStroke="#fff"
                hideZero={true}
                strokeWidth={0}
                hideTicks
              />
            )}
            {tooltipData && tooltipVisible && (
              <g>
                <Line
                  from={{ x: tooltipLeft, y: margin.top }}
                  to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                  stroke={accentColorDark}
                  strokeWidth={2}
                  pointerEvents="none"
                  strokeDasharray="5,2"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop + 1}
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={4}
                  fill={accentColorDark}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </g>
            )}
          </svg>
          {tooltipData && tooltipVisible && (
            <div>
              <TooltipWithBounds
                key={Math.random()}
                top={tooltipTop - 12}
                left={tooltipLeft + 12}
                style={tooltipStyles}
              >
                {`${getStockValue(tooltipData)}`}
              </TooltipWithBounds>
              <Tooltip
                top={innerHeight + margin.top - 40}
                left={tooltipLeft - 10}
                style={{
                  ...defaultStyles,
                  minWidth: 72,
                  textAlign: 'center',
                  transform: 'translateX(-50%)',
                }}
              >
                {formatDate(getDate(tooltipData))}
              </Tooltip>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
);

export default AreaChart;
