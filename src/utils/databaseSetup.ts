
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    // Check if projects table exists
    const { error: checkError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    // If we get a "relation does not exist" error, tables need to be created
    if (checkError && checkError.code === '42P01') {
      console.log('Setting up database tables...');
      
      // You would normally run SQL scripts for this, but for demonstration
      // we'll just log a message that tables need to be created
      console.error('Database tables do not exist. Please run the SQL migrations to create them.');
      
      return false;
    }
    
    console.log('Database tables already exist');
    return true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
};

export const createTablesIfNeeded = async () => {
  const tablesExist = await setupDatabase();
  if (!tablesExist) {
    // In a real app, you'd redirect to a setup page or show an admin notice
    console.error('Please create the necessary database tables in Supabase');
  }
  return tablesExist;
};
