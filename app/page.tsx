'use client'

import { useState, useEffect, useRef } from 'react'
import SearchBar from '@/components/SearchBar'
import Filters from '@/components/Filters'
import LogTable from '@/components/LogTable'
import { LogEntry, SearchResponse } from '@/types/logs'

export default function Home() {
    const [query, setQuery] = useState('')
    const [projectId, setProjectId] = useState('')
    const [deploymentId, setDeploymentId] = useState('')
    const [namespace, setNamespace] = useState('')
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const maxHits = 20

    const fetchLogs = async (offset: number = 0, isPrepend: boolean = false) => {
        if (loading) return

        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (projectId) params.set('projectId', projectId)
            if (deploymentId) params.set('deploymentId', deploymentId)
            if (namespace) params.set('namespace', namespace)
            params.set('maxHits', maxHits.toString())
            params.set('startOffset', offset.toString())

            const response = await fetch(`/api/logs?${params}`)

            if (!response.ok) {
                throw new Error('Failed to fetch logs')
            }

            const data: SearchResponse = await response.json()

            if (isPrepend) {
                const container = scrollContainerRef.current
                if (!container) {
                    setLogs(prev => [...data.hits, ...prev])
                    return
                }

                const prevScrollHeight = container.scrollHeight
                const prevScrollTop = container.scrollTop

                setLogs(prev => [...data.hits, ...prev])

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (container) {
                            const newScrollHeight = container.scrollHeight
                            const addedHeight = newScrollHeight - prevScrollHeight
                            container.scrollTop = prevScrollTop + addedHeight
                        }
                    })
                })
            } else {
                setLogs(data.hits)
            }

            setHasMore(data.hasMore)
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setLogs([])
        setHasMore(true)
        fetchLogs(0)
    }

    const handleLoadMore = () => {
        if (loading || !hasMore) return
        fetchLogs(logs.length, true)
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-2 py-4">
                <div className="bg-white rounded-lg shadow p-3 mb-3">
                    <div className="mb-2">
                        <SearchBar
                            value={query}
                            onChange={setQuery}
                            onSearch={handleSearch}
                        />
                    </div>

                    <Filters
                        projectId={projectId}
                        deploymentId={deploymentId}
                        namespace={namespace}
                        onProjectIdChange={setProjectId}
                        onDeploymentIdChange={setDeploymentId}
                        onNamespaceChange={setNamespace}
                    />
                </div>

                <div className="bg-white rounded-lg shadow relative">
                    {hasMore && logs.length > 0 && (
                        <div className="sticky top-0 z-10 flex justify-center py-2 border-b bg-white">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className="overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 200px)' }}
                    >
                        {loading && logs.length === 0 && (
                            <div className="flex justify-center items-center py-6">
                                <div className="text-gray-500 text-sm">Loading logs...</div>
                            </div>
                        )}

                        <LogTable logs={logs} loading={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}
