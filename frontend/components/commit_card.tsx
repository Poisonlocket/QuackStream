'use client';
import { motion } from 'framer-motion';

interface CommitCardProps {
    commit: {
        author_name: string;
        commit_description: string;
        repository_name: string;
        avatar_url: string;
        id: string;
        timestamp: string; // ISO string e.g. "2025-08-23T14:35:00Z"
    };
    color?: string; // hex color like '#4a90e2'
}

// Utility: add alpha to hex color
function hexWithAlpha(hex: string, alpha: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `#${hex}${alphaHex}`;
}

// Utility: format time in a human-readable way
function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function CommitCard({ commit, color }: CommitCardProps) {
    const accentColor = color ?? '#4a90e2';
    const accentColorLight = hexWithAlpha(accentColor, 0.12);
    const accentColorDark = hexWithAlpha(accentColor, 0.85);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
            style={{ borderLeft: `4px solid ${accentColor}` }}
        >
            {/* Avatar */}
            <div className="flex items-center pl-4">
                <div
                    className="w-10 h-10 rounded-full ring-2 ring-offset-1 overflow-hidden"
                    style={{ borderColor: accentColor }}
                >
                    <img
                        alt={`${commit.author_name}'s avatar`}
                        src={commit.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center flex-1 p-4 space-y-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3
                            className="text-md font-medium leading-tight"
                            style={{ color: accentColorDark }}
                        >
                            {commit.author_name}
                        </h3>
                        <span
                            className="text-xs font-semibold uppercase tracking-wide rounded px-2 py-0.5 inline-block"
                            style={{
                                backgroundColor: accentColorLight,
                                color: accentColorDark,
                                userSelect: 'none',
                            }}
                        >
                            {commit.repository_name}
                        </span>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                        <span
                            className="text-xs font-mono font-semibold px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: accentColorLight,
                                color: accentColorDark,
                                border: `1px solid ${accentColor}`,
                                userSelect: 'none',
                            }}
                        >
                            #{commit.id}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                            {formatTime(commit.timestamp)}
                        </span>
                    </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{commit.commit_description}</p>
            </div>
        </motion.div>
    );
}
