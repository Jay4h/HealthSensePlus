export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
      },
      green: {
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
      },
      orange: {
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-500',
      },
      purple: {
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
      },
      red: {
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div className="stat-card rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colors.iconText}`} />
        </div>
      </div>
    </div>
  );
}
