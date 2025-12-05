import { supabase } from './supabase';

export async function uploadMenuImage(file: File): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.${fileExt}`;
    const filePath = `menu/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteMenuImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/menu-images/');
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];

    await supabase.storage
      .from('menu-images')
      .remove([filePath]);
  } catch (error) {
    console.error('Image deletion failed:', error);
  }
}
