"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import adminService from "../../../lib/modules/admin/admin.service";
import Button from "../../../shared/components/ui/Button";

export default function Statistics() {
  const {
    data: statistics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetch all statistics by admin"],
    queryFn: () => adminService.getStatistics(),
    select: ({ data }) => data,
  });

  const skeletonStats = new Array(5).fill(null);

  return (
    <div className="w-full h-full text-white p-6 flex flex-col gap-6 bg-secondary rounded-2xl">
      <div className="flex justify-between items-center">
        <h1 className="font-brain text-3xl">Статистика</h1>
        <Button variant="second" onClick={() => refetch()}>
          Обновить
        </Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {isLoading
          ? skeletonStats.map((_, index) => (
              <div
                key={index}
                className="bg-third rounded-2xl p-4 flex flex-col items-center justify-center shadow-md animate-pulse"
              >
                <div className="w-16 h-4 bg-gray-500 rounded-full mb-2" />
                <div className="w-10 h-10 bg-gray-400 rounded-full" />
              </div>
            ))
          : statistics?.stats.map((item) => (
              <div
                key={item.label}
                className="bg-third rounded-2xl p-4 flex flex-col items-center justify-center shadow-md"
              >
                <p className="text-lg text-fourth">{item.label}</p>
                <p className="text-3xl font-semibold text-white mt-2">
                  {item.value}
                </p>
              </div>
            ))}
      </div>

      <div className="bg-third rounded-2xl p-6 mt-6 shadow-md">
        <h2 className="text-xl mb-4 font-semibold">Активность по месяцам</h2>
        <div className="w-full h-64">
          {isLoading ? (
            <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics?.chartData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="events" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
