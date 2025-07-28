'use client';
import { motion } from 'framer-motion';

interface CommitCardProps {
    commit: {
        author_name: string;
        commit_description: string;
        repository_name: string;
        avatar_url: string;
        id: string;
    };
    color?: string; // hex color like '#4a90e2'
}

// Utility: add alpha to hex color
function hexWithAlpha(hex: string, alpha: number): string {
    // Ensure hex starts with #
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        // Expand shorthand like #4a9 to #44aa99
        hex = hex.split('').map(c => c + c).join('');
    }
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `#${hex}${alphaHex}`;
}

export default function CommitCard({ commit, color }: CommitCardProps) {
    const accentColor = color ?? '#4a90e2'; // fallback soft blue
    const accentColorLight = hexWithAlpha(accentColor, 0.12); // ~12% opacity
    const accentColorDark = hexWithAlpha(accentColor, 0.85); // ~85% opacity

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
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{commit.commit_description}</p>
            </div>
        </motion.div>
    );
}
