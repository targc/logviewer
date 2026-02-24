'use client'

import { LogEntry } from '@/types/logs'
import { useEffect } from 'react'

interface LogTableProps {
    logs: LogEntry[]
    loading: boolean
}

export default function LogTable({ logs, loading }: LogTableProps) {
    if (logs.length === 0 && !loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No logs found</div>
            </div>
        )
    }

    if (logs.length === 0) {
        return null
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Deployment ID
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Message
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Namespace
                        </th>
                        <th className="px-2 py-1.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            Project ID
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 py-1.5 text-xs text-gray-900 whitespace-nowrap leading-tight">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-2 py-1.5 text-xs text-gray-500 whitespace-nowrap leading-tight">
                                {log.kubernetes.labels?.id || '-'}
                            </td>
                            <td className="px-2 py-1.5 text-xs text-gray-900 font-mono leading-tight">
                                {log.message}
                            </td>
                            <td className="px-2 py-1.5 text-xs text-gray-500 whitespace-nowrap leading-tight">
                                {log.kubernetes.namespace_name}
                            </td>
                            <td className="px-2 py-1.5 text-xs text-gray-500 whitespace-nowrap leading-tight">
                                {log.kubernetes.labels?.projectId || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
