// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { TFunction } from "i18next";

import { Time } from "@foxglove/rostime";
import { Immutable } from "@foxglove/studio";
import { MessagePathDataItem } from "@foxglove/studio-base/components/MessagePathSyntax/useCachedGetMessagePathDataItems";
import { MessageEvent } from "@foxglove/studio-base/players/types";
import { PANEL_TITLE_CONFIG_KEY } from "@foxglove/studio-base/util/layout";
import { TimestampMethod } from "@foxglove/studio-base/util/time";

export type Messages = Record<string, MessageEvent[]>;

export type BasePlotPath = {
  value: string;
  enabled: boolean;
};

export type PlotPath = BasePlotPath & {
  color?: string;
  label?: string;
  timestampMethod: TimestampMethod;
  showLine?: boolean;
  lineSize?: number;
};

export type PlotXAxisVal =
  // x-axis is either receive time since start or header stamp since start
  | "timestamp"
  // The message path values from the latest message for each series. The x-axis is the array
  // "index" of the item and y-axis is the item value
  | "index"
  // The x-axis are values from message path items (accumulated). Each series produces y-values from
  // its message path items. The x/y values are paired by their respective array index locations.
  | "custom"
  // Similar to "index" mode except the x-axis the message path item values and the y-axis are the
  // correspondible series message path value at the same array index. Only the latest message is used
  // for x-axis and each series
  | "currentCustom";

export type PlotDataItem = {
  queriedData: MessagePathDataItem[];
  receiveTime: Time;
  headerStamp?: Time;
};

/**
 * @description Evaluates whether a plot path value is not null, infinite, or NaN.
 * 
 * @param { Immutable<PlotPath> } path - Immutable object value of Plot Path and
 * returns boolean value indicating whether it is not NaN number.
 * 
 * @returns { boolean } a boolean value indicating whether the provided plot path is
 * a valid reference line path.
 */
export function isReferenceLinePlotPathType(path: Immutable<PlotPath>): boolean {
  return !isNaN(Number.parseFloat(path.value));
}

/**
 * @description Takes a value of type `T`, checks if it is undefined or an empty
 * string, and returns the value or undefined.
 * 
 * @param { undefined | T } value - value to be checked for emptiness, which if empty
 * returns `undefined`.
 * 
 * @returns { undefined | T } `undefined` when `value` is an empty string, and the
 * original `value` otherwise.
 */
function presence<T>(value: undefined | T): undefined | T {
  if (value === "") {
    return undefined;
  }

  return value ?? undefined;
}

/**
 * @description Returns a string that displays the label or value of a `PlotPath`
 * element, followed by an index number if necessary, using a provided threshold
 * function to determine which to display.
 * 
 * @param { Readonly<PlotPath> } path - PlotPath object to be displayed.
 * 
 * @param { number } index - 1-based integer index of the plot element being displayed
 * within the overall plot, and is used to construct the display name of the plot element.
 * 
 * @param { TFunction<"plot"> } t - function used to display the path index.
 * 
 * @returns { string } a string representation of the plot path's label or value,
 * followed by the series number (index+1) if neither label nor value is present.
 */
export function plotPathDisplayName(
  path: Readonly<PlotPath>,
  index: number,
  t: TFunction<"plot">,
): string {
  return presence(path.label) ?? presence(path.value) ?? `${t("series")} ${index + 1}`;
}
type DeprecatedPlotConfig = {
  showSidebar?: boolean;
  sidebarWidth?: number;
};

export type PlotConfig = DeprecatedPlotConfig & {
  paths: PlotPath[];
  minXValue?: number;
  maxXValue?: number;
  minYValue?: string | number;
  maxYValue?: string | number;
  showLegend: boolean;
  legendDisplay: "floating" | "top" | "left" | "none";
  showPlotValuesInLegend: boolean;
  showXAxisLabels: boolean;
  showYAxisLabels: boolean;
  isSynced: boolean;
  xAxisVal: PlotXAxisVal;
  xAxisPath?: BasePlotPath;
  followingViewWidth?: number;
  sidebarDimension: number;
  [PANEL_TITLE_CONFIG_KEY]?: string;
};
