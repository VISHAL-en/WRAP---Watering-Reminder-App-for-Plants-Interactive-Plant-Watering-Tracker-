import React from 'react';

export const Skeleton = ({ height, width, borderRadius, style, className }) => {
    const styles = {
        height: height || '1em',
        width: width || '100%',
        borderRadius: borderRadius || '4px',
        backgroundColor: '#e5e7eb',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
    };

    return <div className={`skeleton ${className || ''}`} style={styles} />;
};

export default Skeleton;
