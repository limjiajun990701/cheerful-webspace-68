
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  imageUrl?: string; // already optional
  excerpt: string;
}

// Initial sample blog posts
const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    content: `
# Getting Started with React and TypeScript

React and TypeScript is a powerful combination that can help you build robust web applications. This guide will walk you through setting up a new project and explain some of the key benefits of using TypeScript with React.

## Setting Up Your Project

To create a new React project with TypeScript support, you can use Create React App with the TypeScript template:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

This will generate a new project with all the necessary TypeScript configurations.

## Benefits of TypeScript in React

TypeScript brings several advantages to React development:

1. **Type Safety**: Catch errors during development instead of runtime.
2. **Better IDE Support**: Enjoy improved autocomplete and documentation.
3. **Self-Documenting Code**: Types serve as documentation for your components.
4. **Safer Refactoring**: Make changes with confidence.

## Creating Your First Component

Here's a simple example of a typed React component:

\`\`\`tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color = 'primary' }) => {
  return (
    <button 
      onClick={onClick}
      className={\`btn btn-\${color}\`}
    >
      {text}
    </button>
  );
};

export default Button;
\`\`\`

## Conclusion

Using TypeScript with React can significantly improve your development experience and code quality. While there's a small learning curve, the benefits are well worth the investment.
    `,
    date: "April 15, 2023",
    tags: ["React", "TypeScript", "Development"],
    imageUrl: "",
    excerpt: "A comprehensive guide to setting up a new project with React and TypeScript for better development experience."
  },
  {
    id: "2",
    title: "Designing User-Centered Interfaces",
    content: `
# Designing User-Centered Interfaces

User-centered design is a methodology that puts users at the heart of the design process. By focusing on user needs, preferences, and limitations, you can create interfaces that are intuitive, efficient, and enjoyable to use.

## Key Principles of User-Centered Design

1. **Understand Your Users**
   Before diving into design, take time to understand who your users are, what they need, and how they think. Conduct interviews, surveys, and usability tests to gather insights.

2. **Design for Accessibility**
   Create interfaces that can be used by people with diverse abilities. This includes considerations for color contrast, keyboard navigation, screen readers, and more.

3. **Maintain Consistency**
   Consistent design patterns help users learn your interface faster. Use familiar UI elements and maintain consistency in layout, color, and interactions.

4. **Provide Clear Feedback**
   Users should always know what's happening in your application. Provide visual cues, loading states, success messages, and error notifications.

## Practical Tips for Implementation

### Use Intuitive Navigation

Navigation should be intuitive and accessible. Consider these guidelines:
- Keep the main navigation visible and consistent across pages
- Use breadcrumbs for complex hierarchies
- Provide clear visual indicators for current location

### Optimize Forms for Usability

Forms are often critical touchpoints in user journeys:
- Label fields clearly
- Provide helpful validation messages
- Group related fields together
- Consider inline validation for immediate feedback

### Design for Different Devices

Responsive design isn't just about making layouts fit different screens:
- Consider different input methods (touch vs. mouse)
- Optimize tap targets for touch devices
- Test on actual devices when possible

## Conclusion

User-centered design is an ongoing process of learning, designing, testing, and refining. By keeping users at the center of your design decisions, you'll create interfaces that truly meet their needs and provide a positive experience.
    `,
    date: "March 22, 2023",
    tags: ["Design", "UX", "UI"],
    imageUrl: "",
    excerpt: "Explore the principles of user-centered design and how to apply them to create more intuitive interfaces."
  }
];

// Function to get all blog posts (simulates a database fetch)
export const getAllBlogPosts = (): Promise<BlogPost[]> => {
  // Get blogs from localStorage or use initial data
  const storedBlogs = localStorage.getItem('blogPosts');
  const blogPosts = storedBlogs ? JSON.parse(storedBlogs) : initialBlogPosts;
  
  return Promise.resolve(blogPosts);
};

// Function to get a single blog post by ID
export const getBlogPostById = (id: string): Promise<BlogPost | undefined> => {
  const storedBlogs = localStorage.getItem('blogPosts');
  const blogPosts = storedBlogs ? JSON.parse(storedBlogs) : initialBlogPosts;
  
  const post = blogPosts.find((post: BlogPost) => post.id === id);
  return Promise.resolve(post);
};

// Function to add a new blog post
export const addBlogPost = (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  const storedBlogs = localStorage.getItem('blogPosts');
  const blogPosts = storedBlogs ? JSON.parse(storedBlogs) : initialBlogPosts;
  
  // Generate a new ID
  const newId = (Math.max(...blogPosts.map((p: BlogPost) => parseInt(p.id) || 0), 0) + 1).toString();
  
  const newPost = {
    ...post,
    id: newId
  };
  
  const updatedPosts = [...blogPosts, newPost];
  localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  
  return Promise.resolve(newPost);
};

// Function to update an existing blog post
export const updateBlogPost = (post: BlogPost): Promise<BlogPost> => {
  const storedBlogs = localStorage.getItem('blogPosts');
  const blogPosts = storedBlogs ? JSON.parse(storedBlogs) : initialBlogPosts;
  
  const updatedPosts = blogPosts.map((p: BlogPost) => 
    p.id === post.id ? post : p
  );
  
  localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  
  return Promise.resolve(post);
};

// Function to delete a blog post
export const deleteBlogPost = (id: string): Promise<void> => {
  const storedBlogs = localStorage.getItem('blogPosts');
  const blogPosts = storedBlogs ? JSON.parse(storedBlogs) : initialBlogPosts;
  
  const updatedPosts = blogPosts.filter((p: BlogPost) => p.id !== id);
  localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  
  return Promise.resolve();
};
