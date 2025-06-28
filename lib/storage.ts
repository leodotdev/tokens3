import { supabase } from './supabase';
import { Platform } from 'react-native';

/**
 * Get a properly formatted storage URL that works with CORS on web
 * @param url - The image URL (can be a full URL or just the path)
 * @returns Properly formatted URL with CORS handling
 */
export function getStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // For web platform, ensure we're using HTTPS
    if (Platform.OS === 'web' && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }

  // If it's a relative path, construct the full Supabase storage URL
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  // Remove leading slash if present
  const path = url.startsWith('/') ? url.slice(1) : url;
  
  // Construct the storage URL
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}

/**
 * Upload an image to Supabase storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  bucket: string,
  path: string,
  file: File | Blob
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload exception:', error);
    return { url: null, error: error as Error };
  }
}