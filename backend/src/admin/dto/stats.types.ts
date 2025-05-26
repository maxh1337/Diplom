export interface Stats {
  stats: {
    label: string;
    value: number;
  }[];
  chartData: {
    name: string;
    users: number;
    events: number;
  }[];
}
