// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service-role key (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes(process.env.ADMIN_PASSWORD || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data (native Next.js 14 App Router support)
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string
    const path = formData.get('path') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!bucket || !path) {
      return NextResponse.json({ error: 'Missing bucket or path' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'audio/wav', 
      'audio/x-wav', 
      'audio/wave',
      'audio/mpeg', 
      'audio/mp3'
    ]
    
    const fileType = file.type || 'application/octet-stream'
    
    console.log('Upload request:', {
      bucket,
      path,
      fileType,
      size: file.size
    })

    // Convert File to ArrayBuffer, then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    console.log('Upload successful:', urlData.publicUrl)

    return NextResponse.json({
      success: true,
      publicUrl: urlData.publicUrl,
      path: data.path
    })
