
import { supabase } from '@/integrations/supabase/client';

// Helper function to create storage bucket if it doesn't exist
export const setupSiteImagesBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'site-images');
    
    if (!bucketExists) {
      // Create bucket for site images
      const { error } = await supabase.storage.createBucket('site-images', {
        public: true
      });
      
      if (error) {
        console.error('Error creating site-images bucket:', error);
        return false;
      }
      
      console.log('Created site-images bucket successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up site-images bucket:', error);
    return false;
  }
};

// Helper function to get dynamic site content
export const getSiteContent = async (pageName: string, sectionName: string) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', pageName)
      .eq('section_name', sectionName)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${pageName}/${sectionName} content:`, error);
    return null;
  }
};
