"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "../../../shared/components/ui/Button";

const stats = [
  { label: "Пользователи", value: 432 },
  { label: "Ивенты", value: 27 },
  { label: "Активные ивенты", value: 14 },
  { label: "Отзывы", value: 134 },
  { label: "Админы", value: 5 },
];

const chartData = [
  { name: "Янв", users: 20, events: 5 },
  { name: "Фев", users: 50, events: 12 },
  { name: "Мар", users: 90, events: 8 },
  { name: "Апр", users: 70, events: 15 },
  { name: "Май", users: 120, events: 22 },
];

export default function Statistics() {
  return (
    <div className="w-full h-full text-white p-6 flex flex-col gap-6 bg-secondary rounded-2xl">
      <div className="flex justify-between">
        <h1 className="font-brain text-3xl mb-2">Статистика</h1>
        <Button variant="second">Обновить</Button>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {stats.map((item) => (
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="events" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
