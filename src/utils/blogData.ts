
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/database';

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    // Map database column names to our interface properties
    return data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
};

// Add a new blog post
export const addBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        content: post.content,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        imageurl: post.imageurl
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    return data;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
};

// Update an existing blog post
export const updateBlogPost = async (post: BlogPost): Promise<BlogPost> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: post.title,
        content: post.content,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        imageurl: post.imageurl
      })
      .eq('id', post.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from update");
    }

    return data;
  } catch (error) {
    console.error(`Error updating blog post with ID ${post.id}:`, error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};
