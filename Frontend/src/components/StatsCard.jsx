// ==============================================
// STATS CARD COMPONENT - ENHANCED WITH ANIMATIONS
// ==============================================
// This component displays a single statistic card with:
// - Animated number counter
// - Hover effects with lift and glow
// - Gradient icon backgrounds
// - Staggered entrance animations

import { useState, useEffect, useRef } from 'react';

// ==============================================
// ANIMATED COUNTER HOOK
// ==============================================
// Animates a number from 0 to target value
function useAnimatedCounter(targetValue, duration = 1000) {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);

    useEffect(() => {
        // Parse the target value (handle strings like "850")
        const target = parseInt(targetValue) || 0;
        if (target === 0) {
            setCount(0);
            return;
        }

        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

            setCount(currentValue);

            if (progress < 1) {
                countRef.current = requestAnimationFrame(animate);
            }
        };

        countRef.current = requestAnimationFrame(animate);

        return () => {
            if (countRef.current) {
                cancelAnimationFrame(countRef.current);
            }
        };
    }, [targetValue, duration]);

    return count;
}

// ==============================================
// STATS CARD COMPONENT
// ==============================================
// Props:
//   - icon: Material Symbol icon name (e.g., 'school', 'group')
//   - iconBg: Background color for the icon
//   - iconColor: Color for the icon
//   - label: The label text (e.g., 'Total Mentors')
//   - value: The main value to display (e.g., '48')
//   - trend: Optional trend text (e.g., '+2 this month')
//   - trendType: 'positive', 'negative', or 'neutral'
//   - gradient: Optional gradient type ('purple', 'pink', 'cyan', 'orange')
//   - delay: Animation delay in ms for staggered entrance

function StatsCard({
    icon,
    iconBg = 'var(--primary-light)',
    iconColor = 'var(--primary)',
    label,
    value,
    trend,
    trendType = 'neutral',
    gradient,
    delay = 0
}) {
    // Animated counter for numeric values
    const numericValue = parseInt(value);
    const isNumeric = !isNaN(numericValue);
    const animatedValue = useAnimatedCounter(isNumeric ? numericValue : 0, 1200);

    // Hover state for additional effects
    const [isHovered, setIsHovered] = useState(false);

    // Gradient configurations for icon backgrounds
    const gradientMap = {
        purple: { bg: 'var(--accent-purple-light)', color: 'var(--accent-purple)', glow: 'var(--shadow-glow-purple)' },
        pink: { bg: 'var(--accent-pink-light)', color: 'var(--accent-pink)', glow: 'var(--shadow-glow-pink)' },
        cyan: { bg: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', glow: '0 0 20px rgba(6, 182, 212, 0.3)' },
        orange: { bg: 'var(--accent-orange-light)', color: 'var(--accent-orange)', glow: '0 0 20px rgba(249, 115, 22, 0.3)' },
        emerald: { bg: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', glow: '0 0 20px rgba(16, 185, 129, 0.3)' },
    };

    const gradientStyle = gradient ? gradientMap[gradient] : null;
    const finalIconBg = gradientStyle ? gradientStyle.bg : iconBg;
    const finalIconColor = gradientStyle ? gradientStyle.color : iconColor;
    const glowColor = gradientStyle ? gradientStyle.glow : 'var(--shadow-glow-primary)';

    // Determine trend color based on type
    const getTrendColor = () => {
        switch (trendType) {
            case 'positive':
                return '#10b981';  // Green
            case 'negative':
                return '#ef4444';  // Red
            default:
                return 'var(--text-secondary)';  // Gray
        }
    };

    return (
        // Card container with hover effects and animations
        <div
            className="stats-card-enhanced"
            style={{
                opacity: 0,
                animation: `fadeInUp 0.5s ease forwards`,
                animationDelay: `${delay}ms`,
                boxShadow: isHovered ? `var(--shadow-lg), ${glowColor}` : 'var(--shadow-sm)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Left side - Text content */}
            <div>
                {/* Label - small text above the value */}
                <p
                    className="stats-card-label"
                    style={{
                        transition: 'color 0.2s ease',
                        color: isHovered ? 'var(--primary)' : 'var(--text-secondary)',
                    }}
                >
                    {label}
                </p>

                {/* Value - the big number with counter animation */}
                <h3
                    className="stats-card-value"
                    style={{
                        transition: 'transform 0.2s ease',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'left',
                    }}
                >
                    {isNumeric ? animatedValue.toLocaleString() : value}
                </h3>

                {/* Trend - optional indicator below the value */}
                {trend && (
                    <p
                        className="text-xs font-medium"
                        style={{
                            marginTop: 'var(--space-1)',
                            color: getTrendColor(),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-1)',
                        }}
                    >
                        {/* Show arrow icon for positive/negative trends */}
                        {trendType === 'positive' && (
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '14px',
                                    animation: trendType === 'positive' ? 'bounce 2s ease infinite' : 'none',
                                }}
                            >
                                trending_up
                            </span>
                        )}
                        {trendType === 'negative' && (
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: '14px',
                                }}
                            >
                                trending_down
                            </span>
                        )}
                        {trend}
                    </p>
                )}
            </div>

            {/* Right side - Icon with enhanced styling */}
            <div
                className="stats-card-icon-enhanced"
                style={{
                    backgroundColor: finalIconBg,
                    color: finalIconColor,
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1) rotate(0)',
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        fontSize: '24px',
                        transition: 'transform 0.3s ease',
                    }}
                >
                    {icon}
                </span>
            </div>
        </div>
    );
}

// Export the component
export default StatsCard;
