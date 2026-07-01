import { useRef } from 'react';

const MonthlyHeatmap = ({ history }) => {
    // Group history by month YYYY-MM
    const months = {};
    const today = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthName = d.toLocaleString('default', { month: 'short', year: 'numeric' });

        // Days in month
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

        months[key] = {
            name: monthName,
            days: Array(daysInMonth).fill(0).map((_, idx) => ({
                day: idx + 1,
                count: 0,
                dateStr: `${key}-${String(idx + 1).padStart(2, '0')}`
            }))
        };
    }

    // Populate data
    history.forEach(log => {
        const date = new Date(log.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (months[key]) {
            const dayIdx = date.getDate() - 1;
            if (months[key].days[dayIdx]) {
                months[key].days[dayIdx].count += 1;
            }
        }
    });

    const getColor = (count) => {
        if (count === 0) return '#E2E8F0';
        if (count === 1) return '#A8DF8E';
        return '#15803d';
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {Object.values(months).reverse().map(month => (
                <div key={month.name} className="card" style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#475569' }}>{month.name}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {month.days.map(d => (
                            <div
                                key={d.dateStr}
                                title={`Watered ${d.count} times on ${d.dateStr}`}
                                style={{
                                    aspectRatio: '1',
                                    background: getColor(d.count),
                                    borderRadius: '4px',
                                    fontSize: '0.6rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: d.count > 0 ? (d.count === 1 ? '#1f2937' : 'white') : '#94a3b8',
                                    fontWeight: d.count > 0 ? 'bold' : 'normal'
                                }}
                            >
                                {d.day}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MonthlyHeatmap;
