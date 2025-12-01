import { useTranslation } from 'react-i18next';
import StatsCard from './StatsCard';

function StatsGrid({ stats }) {
  const { t } = useTranslation('waiter');

  const formattedStats = stats.map(stat => ({
    ...stat,
    title: t(`reports.${stat.titleKey}`)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {formattedStats.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  );
}

export default StatsGrid;