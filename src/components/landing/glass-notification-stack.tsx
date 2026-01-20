"use client";

import React from "react";
import { motion } from "motion/react";
import { Bell, Clock, Calendar } from "lucide-react";

const reminders = [
    {
        id: 1,
        title: "Google Interview",
        time: "Tomorrow, 10:00 AM",
        type: "urgent",
        icon: Calendar,
    },
    {
        id: 2,
        title: "Follow up: Meta",
        time: "2 days ago",
        type: "warning",
        icon: Clock,
    },
    {
        id: 3,
        title: "Update Resume",
        time: "Just now",
        type: "info",
        icon: Bell,
    },
];

export function GlassNotificationStack() {
    return (
        <div className="w-full h-full flex flex-col justify-end pb-4 px-4">
            <div className="flex flex-col gap-3">
                {reminders.map((reminder, index) => {
                    return (
                        <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/[0.08] transition-colors group"
                        >
                            <div className={`p-2 rounded-full shrink-0 ${reminder.type === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                    reminder.type === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                                        'bg-blue-500/20 text-blue-300'
                                }`}>
                                <reminder.icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-200 transition-colors">
                                    {reminder.title}
                                </h4>
                                <p className="text-xs text-white/50 truncate font-light tracking-wide">{reminder.time}</p>
                            </div>

                            {index === 0 && (
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
