import type { DataRow, ChartSettings } from '../../../types';

export interface WaterfallChartProps {
  data: DataRow[];
  settings: ChartSettings;
  width?: number;
  height?: number;
  onBarSelect?: (barId: string | undefined) => void;
  onDataChange?: (data: DataRow[]) => void;
}

export interface WaterfallBarProps {
  payload: any;
  x: number;
  y: number;
  width: number;
  height: number;
  settings: ChartSettings;
}

export interface WaterfallTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  settings: ChartSettings;
}

export interface WaterfallLabelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  settings: ChartSettings;
  payload: any;
}

export interface WaterfallConnectorProps {
  data: any[];
  settings: ChartSettings;
}

export interface WaterfallDataItem {
  id: string;
  name: string;
  value: number;
  baseValue: number;
  displayValue: number;
  start: number;
  end: number;
  type: string;
  color?: string;
  isNegative?: boolean;
  segments?: Array<{
    categoria: string;
    valor: number;
    cor: string;
  }>;
}