import { NextRequest, NextResponse } from 'next/server'
import { SearchResponse } from '@/types/logs'

const QUICKWIT_URL = process.env.QUICKWIT_URL || 'http://35.197.154.173:17280'
const QUICKWIT_INDEX = process.env.QUICKWIT_INDEX || 'k8s-logs-prod'
const QUICKWIT_USER = process.env.QUICKWIT_USER
const QUICKWIT_PASS = process.env.QUICKWIT_PASS

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const q = searchParams.get('q')
    const projectId = searchParams.get('projectId')
    const deploymentId = searchParams.get('deploymentId')
    const namespace = searchParams.get('namespace')
    const container = searchParams.get('container')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')
    const maxHits = parseInt(searchParams.get('maxHits') || '50')
    const startOffset = parseInt(searchParams.get('startOffset') || '0')

    const queryParts: string[] = []

    if (q) {
        queryParts.push(`message:${q}`)
    }

    if (projectId) {
        queryParts.push(`kubernetes.labels.projectId:${projectId}`)
    }

    if (deploymentId) {
        queryParts.push(`kubernetes.labels.id:${deploymentId}`)
    }

    if (namespace) {
        queryParts.push(`kubernetes.namespace_name:${namespace}`)
    }

    if (container) {
        queryParts.push(`kubernetes.container_name:${container}`)
    }

    if (startTime || endTime) {
        const start = startTime || '*'
        const end = endTime || '*'
        queryParts.push(`timestamp:[${start} TO ${end}]`)
    }

    const query = queryParts.length > 0 ? queryParts.join(' AND ') : '*'


    const quickwitQuery = {
        query,
        max_hits: maxHits,
        start_offset: startOffset,
        sort_by: '-timestamp'
    }

    console.log({ quickwitQuery })

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        if (QUICKWIT_USER && QUICKWIT_PASS) {
            const credentials = Buffer.from(`${QUICKWIT_USER}:${QUICKWIT_PASS}`).toString('base64')
            headers['Authorization'] = `Basic ${credentials}`
        }

        const response = await fetch(`${QUICKWIT_URL}/api/v1/${QUICKWIT_INDEX}/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify(quickwitQuery),
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('[Quickwit Error]', {
                status: response.status,
                statusText: response.statusText,
                body: errorBody,
                query: quickwitQuery,
            })
            return NextResponse.json(
                { error: `Quickwit error: ${response.statusText}` },
                { status: response.status }
            )
        }

        const data = await response.json()

        const result: SearchResponse = {
            hits: data.hits || [],
            numHits: data.num_hits || 0,
            offset: startOffset,
            hasMore: (data.num_hits || 0) > startOffset + maxHits
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('[Quickwit Fetch Error]', {
            error: error instanceof Error ? error.message : String(error),
            query: quickwitQuery,
            url: `${QUICKWIT_URL}/api/v1/${QUICKWIT_INDEX}/search`,
        })
        return NextResponse.json(
            { error: `Failed to fetch logs: ${error}` },
            { status: 500 }
        )
    }
}
