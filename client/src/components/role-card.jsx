import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function RoleCard({ title, icon: Icon, color, description, features, onClick }) {
  const getColorClasses = (color) => {
    const colorMap = {
      'medical-blue': {
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        hoverIconBg: 'group-hover:bg-blue-600',
        hoverIconText: 'group-hover:text-white',
        buttonBg: 'bg-blue-600',
        buttonHover: 'hover:bg-blue-700',
        border: 'hover:border-blue-200',
      },
      'healing-green': {
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        hoverIconBg: 'group-hover:bg-green-600',
        hoverIconText: 'group-hover:text-white',
        buttonBg: 'bg-green-600',
        buttonHover: 'hover:bg-green-700',
        border: 'hover:border-green-200',
      },
      'healthcare-orange': {
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-500',
        hoverIconBg: 'group-hover:bg-orange-500',
        hoverIconText: 'group-hover:text-white',
        buttonBg: 'bg-orange-500',
        buttonHover: 'hover:bg-orange-600',
        border: 'hover:border-orange-200',
      },
      'purple': {
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        hoverIconBg: 'group-hover:bg-purple-600',
        hoverIconText: 'group-hover:text-white',
        buttonBg: 'bg-purple-600',
        buttonHover: 'hover:bg-purple-700',
        border: 'hover:border-purple-200',
      },
    };
    return colorMap[color] || colorMap['medical-blue'];
  };

  const colors = getColorClasses(color);

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${colors.border} group cursor-pointer`}>
      <div className="p-8 text-center">
        <div className={`w-16 h-16 ${colors.iconBg} ${colors.hoverIconBg} rounded-full flex items-center justify-center mx-auto mb-6 transition-colors`}>
          <Icon className={`${colors.iconText} ${colors.hoverIconText} h-8 w-8 transition-colors`} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        
        <p className="text-gray-600 text-sm mb-6">
          {description}
        </p>
        
        <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onClick}
          className={`w-full ${colors.buttonBg} ${colors.buttonHover} text-white transition-colors`}
        >
          Access Dashboard
        </Button>
      </div>
    </div>
  );
}
