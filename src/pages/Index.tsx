
import React, { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Award, Smartphone, Code, Layout, Database, Server, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getExpertiseContent, getSiteContent } from "@/utils/contentUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CollectionCarousel from "@/components/collections/CollectionCarousel";

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  image_url: string | null;
}

const funFacts = [
  "✈️ Love building apps that make life easier!",
];

const Index = () => {
  const [expertise, setExpertise] = useState({
    title: 'My Expertise',
    subtitle: 'I specialize in full-stack development with experience in both mobile and web technologies.',
    skills: [
      { name: "Flutter", color: "bg-blue-100 text-blue-800" },
      { name: "Vue.js", color: "bg-green-100 text-green-800" },
      { name: "Java", color: "bg-orange-100 text-orange-800" },
      { name: "TypeScript", color: "bg-indigo-100 text-indigo-800" },
      { name: "PHP", color: "bg-purple-100 text-purple-800" },
      { name: "AWS", color: "bg-yellow-100 text-yellow-800" },
      { name: "Azure", color: "bg-blue-100 text-blue-800" },
      { name: "MySQL", color: "bg-cyan-100 text-cyan-800" },
    ],
    items: [
      {
        id: "1",
        title: "Mobile Development",
        description: "Building responsive and feature-rich mobile applications using Flutter and native technologies.",
        icon: "smartphone"
      },
      {
        id: "2",
        title: "Frontend Development",
        description: "Creating responsive and intuitive user interfaces with Vue.js, TypeScript, and modern web technologies.",
        icon: "layout"
      },
      {
        id: "3",
        title: "Backend Development",
        description: "Building robust server-side applications and APIs using Java, PHP, and database technologies.",
        icon: "server"
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [factIndex, setFactIndex] = useState(0);

  // New state for hero content
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [heroImageError, setHeroImageError] = useState(false);

  // Fetch Hero Content
  useEffect(() => {
    const fetchHeroContent = async () => {
      setIsHeroLoading(true);
      setHeroImageError(false);
      try {
        const data = await getSiteContent('home', 'hero');
        const defaultContent = {
          title: 'LIM JIA <span class="text-primary animate-pulse">JUN</span>',
          subtitle: 'Full-Stack Developer',
          description: 'Fresh graduate specializing in <span class="text-primary">full-stack development</span> with expertise in Flutter, Vue.js, and Java.',
          image_url: null,
        };
        
        if (data) {
          setHeroContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle || defaultContent.subtitle,
            description: data.description || defaultContent.description,
            image_url: data.image_url || null,
          });
        } else {
          setHeroContent(defaultContent);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
        // Set default content on error
        setHeroContent({
          title: 'LIM JIA <span class="text-primary animate-pulse">JUN</span>',
          subtitle: 'Full-Stack Developer',
          description: 'Fresh graduate specializing in <span class="text-primary">full-stack development</span> with expertise in Flutter, Vue.js, and Java.',
          image_url: null,
        });
      } finally {
        setIsHeroLoading(false);
      }
    };
    
    fetchHeroContent();
  }, []);

  useEffect(() => {
    const fetchExpertiseContent = async () => {
      try {
        setIsLoading(true);
        const data = await getExpertiseContent();
        
        if (data) {
          // Parse description field as JSON
          let parsedItems = [];
          let parsedSkills = [];
          
          try {
            const descData = JSON.parse(data.description || '{}');
            parsedItems = descData.items || [];
            parsedSkills = descData.skills || [];
          } catch (e) {
            console.error('Error parsing expertise JSON:', e);
          }
          
          if (parsedItems.length && parsedSkills.length) {
            // Create skill colors
            const skillsWithColors = parsedSkills.map((skill: string, index: number) => {
              const colorOptions = [
                "bg-blue-100 text-blue-800",
                "bg-green-100 text-green-800",
                "bg-orange-100 text-orange-800",
                "bg-indigo-100 text-indigo-800",
                "bg-purple-100 text-purple-800",
                "bg-yellow-100 text-yellow-800",
                "bg-cyan-100 text-cyan-800",
                "bg-red-100 text-red-800",
              ];
              
              return {
                name: skill,
                color: colorOptions[index % colorOptions.length]
              };
            });
            
            setExpertise({
              title: data.title || 'My Expertise',
              subtitle: data.subtitle || 'I specialize in full-stack development with experience in both mobile and web technologies.',
              skills: skillsWithColors,
              items: parsedItems
            });
          }
        }
      } catch (error) {
        console.error('Error fetching expertise content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpertiseContent();
  }, []);

  // Fun fact ticker
  useEffect(() => {
    const t = setInterval(() => setFactIndex(i => (i + 1) % funFacts.length), 3500);
    return () => clearInterval(t);
  }, []);

  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'smartphone': return <Smartphone />;
      case 'code': return <Code />;
      case 'layout': return <Layout />;
      case 'database': return <Database />;
      case 'server': return <Server />;
      case 'globe': return <Globe />;
      default: return <Code />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Modern and Clean Design */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background with animated diagonal lines */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background -z-10" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,rgba(0,0,0,.02)25%,transparent_25%,transparent_75%,rgba(0,0,0,.02)75%)]" />

        {/* Animated Hero content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side: Text content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                {isHeroLoading ? (
                  <>
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-20 w-96" />
                    <Skeleton className="h-16 w-full mt-4" />
                  </>
                ) : heroContent ? (
                  <>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-sm">
                      {heroContent.subtitle}
                    </Badge>
                    <h1
                      className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
                      dangerouslySetInnerHTML={{ __html: heroContent.title }}
                    />
                    <p
                      className="text-xl md:text-2xl text-muted-foreground mt-4 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: heroContent.description }}
                    />
                  </>
                ) : null}
              </div>
              {/* Fun facts carousel */}
              <div className="my-6 text-lg/relaxed font-medium text-center md:text-left">
                <span className="inline-flex items-center gap-2 text-primary">
                  <span>{funFacts[factIndex]}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="group gap-2">
                  <Link to="/projects">
                    Explore My Work
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/about">
                    About Me
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-5 pt-6 md:pt-10">
                {expertise.skills.slice(0, 4).map((skill, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className={`${skill.color} px-3 py-1.5 text-sm`}
                  >
                    {skill.name}
                  </Badge>
                ))}
                <Link to="/about" className="inline-flex items-center gap-1 text-primary hover:underline">
                  +{expertise.skills.length - 4} more skills
                </Link>
              </div>
            </div>

            {/* Right side: Image */}
            <div className="hidden md:flex justify-center items-center animate-fade-in">
              {isHeroLoading ? (
                <Skeleton className="w-full max-w-md h-[450px] rounded-lg" />
              ) : heroContent?.image_url && !heroImageError ? (
                <img
                  src={heroContent.image_url}
                  alt="Hero"
                  className="rounded-xl shadow-2xl w-full max-w-md h-auto object-cover"
                  onError={() => setHeroImageError(true)}
                  style={{ aspectRatio: '4/5' }}
                />
              ) : (
                <div className="w-full max-w-md h-[450px] bg-muted/50 rounded-lg flex items-center justify-center border border-dashed">
                  <div className="text-center text-muted-foreground">
                    <Layout className="mx-auto h-12 w-12 mb-2" />
                    <p>Hero image appears here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Collection Carousel Section */}
      <CollectionCarousel />
      
      {/* Expertise Section - Clean Card Layout */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-10">
              <div className="space-y-2">
                <Skeleton className="h-10 w-64 mx-auto" />
                <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Skeleton className="h-72 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
                <Skeleton className="h-72 rounded-xl" />
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">{expertise.title}</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {expertise.subtitle}
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {expertise.items.map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-2 bg-primary w-full"></div>
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                        <div className="text-primary">
                          {renderIcon(item.icon)}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Button asChild variant="outline" size="lg" className="group">
                  <Link to="/experience">
                    View My Experience
                    <ExternalLink className="ml-2 h-4 w-4 transition-all group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Certifications Section - Modern Layout */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1">Achievements</Badge>
            <h2 className="text-4xl font-bold mb-3">Certifications & Credentials</h2>
            <div className="h-1 w-24 bg-primary/30 mx-auto"></div>
          </div>
          
          <div className="flex justify-center">
            <Button asChild variant="default" size="lg" className="gap-2">
              <Link to="/certifications">
                <Award className="h-5 w-5 mr-2" />
                View All Certifications
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work Together?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              I'm currently available for freelance projects, full-time positions, and collaborative opportunities.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
