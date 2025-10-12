# Audio File Storage

## Directory Structure
- `covers/`   — Album/artist artwork (1400x1400px, JPG/PNG)
- `tracks/`   — Full audio files (320kbps MP3 minimum)
- `previews/` — 30-second preview clips (128kbps MP3)

## Naming Convention
- Covers: `{artistSlug}-{releaseSlug}.jpg`
- Tracks: `{trackSlug}-full.mp3`
- Previews: `{trackSlug}-preview.mp3`

## Migration Plan
These local files will be migrated to S3 (Issue #1). Until then:
- Max file size: 50MB per track
- Supported formats: MP3 only (WAV/FLAC coming with S3)
