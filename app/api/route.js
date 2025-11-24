import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    if (!filename) return NextResponse.json({ error: 'filename required' }, { status: 400 });
    // sanitize filename to prevent path traversal
    const safeName = path.basename(filename);

    // check both public/images and public root
    const candidates = [
      path.join(process.cwd(), 'public', 'images', safeName),
      path.join(process.cwd(), 'public', safeName),
    ];

    let data = null;
    let foundPath = null;
    for (const p of candidates) {
      try {
        data = await fs.promises.readFile(p);
        foundPath = p;
        break;
      } catch (err) {
        // try next
      }
    }
    if (!data) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
}
