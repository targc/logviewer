'use client'

interface FiltersProps {
    projectId: string
    deploymentId: string
    namespace: string
    onProjectIdChange: (value: string) => void
    onDeploymentIdChange: (value: string) => void
    onNamespaceChange: (value: string) => void
}

export default function Filters({
    projectId,
    deploymentId,
    namespace,
    onProjectIdChange,
    onDeploymentIdChange,
    onNamespaceChange,
}: FiltersProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Project ID
                </label>
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => onProjectIdChange(e.target.value)}
                    placeholder="Filter by project ID..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Deployment ID
                </label>
                <input
                    type="text"
                    value={deploymentId}
                    onChange={(e) => onDeploymentIdChange(e.target.value)}
                    placeholder="Filter by deployment ID..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Namespace
                </label>
                <input
                    type="text"
                    value={namespace}
                    onChange={(e) => onNamespaceChange(e.target.value)}
                    placeholder="Filter by namespace..."
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-900"
                />
            </div>
        </div>
    )
}
