export type DashboardBlockData = {
  completion: number;
  completionDayLabel: string;
  recommendation: string;
  appointmentTime: string;
  appointmentDate: string;
  summaryDate: string;
  summaryRows: number[];
};

export type DashboardBlockResponse = {
  data: DashboardBlockData;
  updatedAt: string;
};

export type DashboardBlockUpdateRequest = {
  data: DashboardBlockData;
};
