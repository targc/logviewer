export interface LogEntry {
  timestamp: string
  message: string
  kubernetes: {
    pod_name: string
    namespace_name: string
    container_name: string
    host?: string
    labels?: {
      projectId?: string
      [key: string]: any
    }
  }
  service_body?: string
}

export interface SearchParams {
  q?: string
  projectId?: string
  pod?: string
  namespace?: string
  container?: string
  startTime?: string
  endTime?: string
  maxHits?: number
  startOffset?: number
}

export interface SearchResponse {
  hits: LogEntry[]
  numHits: number
  offset: number
  hasMore: boolean
}
