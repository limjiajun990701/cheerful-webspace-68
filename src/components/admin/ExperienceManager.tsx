import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getExperienceItems, 
  createExperienceItem, 
  updateExperienceItem, 
  deleteExperienceItem 
} from "@/utils/contentUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseIcon, GraduationCap, Plus, Edit, Trash2 } from "lucide-react";

const formSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['work', 'education']),
  title: z.string().min(1, { message: "Title is required" }),
  company: z.string().min(1, { message: "Company/Institution is required" }),
  location: z.string(),
  date: z.string(),
  description: z.string().min(1, { message: "Description is required" }),
  skills: z.array(z.string()).default([]),
  achievements: z.array(z.object({
    title: z.string(),
    value: z.string()
  })).default([]),
  durationInMonths: z.number().min(0).default(0)
});

type FormValues = z.infer<typeof formSchema>;

interface ExperienceItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  skills: string[];
  achievements: { title: string, value: string }[];
  durationInMonths: number;
}

const ExperienceManager = () => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'work',
      title: '',
      company: '',
      location: '',
      date: '',
      description: '',
      skills: [],
      achievements: [],
      durationInMonths: 0
    },
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    const data = await getExperienceItems();
    setExperiences(data);
    setIsLoading(false);
  };

  const handleEdit = (experience: ExperienceItem) => {
    setActiveTab(experience.type);
    form.reset({
      id: experience.id,
      type: experience.type,
      title: experience.title,
      company: experience.company,
      location: experience.location,
      date: experience.date,
      description: experience.description,
      skills: experience.skills || [],
      achievements: experience.achievements || [],
      durationInMonths: experience.durationInMonths || 0
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      const result = await deleteExperienceItem(id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        });
        fetchExperiences();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete experience",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let result;
      
      if (values.id) {
        result = await updateExperienceItem(values.id, values);
      } else {
        result = await createExperienceItem(values.type, values);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Experience ${values.id ? 'updated' : 'created'} successfully`,
        });
        setIsOpen(false);
        form.reset();
        fetchExperiences();
      } else {
        toast({
          title: "Error",
          description: `Failed to ${values.id ? 'update' : 'create'} experience`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'work' | 'education');
    form.setValue('type', value as 'work' | 'education');
  };

  const workExperiences = experiences.filter(exp => exp.type === 'work');
  const educationExperiences = experiences.filter(exp => exp.type === 'education');

  // Add a handler for skills and achievements
  const [newSkill, setNewSkill] = useState('');
  const [newAchievementTitle, setNewAchievementTitle] = useState('');
  const [newAchievementValue, setNewAchievementValue] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = form.getValues('skills') || [];
      form.setValue('skills', [...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues('skills') || [];
    form.setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievementTitle.trim() && newAchievementValue.trim()) {
      const currentAchievements = form.getValues('achievements') || [];
      form.setValue('achievements', [...currentAchievements, {
        title: newAchievementTitle.trim(),
        value: newAchievementValue.trim()
      }]);
      setNewAchievementTitle('');
      setNewAchievementValue('');
    }
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = form.getValues('achievements') || [];
    form.setValue('achievements', currentAchievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Experiences</h2>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            form.reset();
            setNewSkill('');
            setNewAchievementTitle('');
            setNewAchievementValue('');
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {form.getValues('id') ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="work" className="flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      Work
                    </TabsTrigger>
                    <TabsTrigger value="education" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <RadioGroupItem value="work" />
                          <RadioGroupItem value="education" />
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder={activeTab === 'work' ? "Job Title" : "Degree"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{activeTab === 'work' ? "Company" : "Institution"}</FormLabel>
                        <FormControl>
                          <Input placeholder={activeTab === 'work' ? "Company Name" : "School/University Name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jan 2020 - Present" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="durationInMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Duration in months" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your experience" 
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Skills section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Skills</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {form.getValues('skills')?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1">
                        <span className="text-sm">{skill}</span>
                        <button 
                          type="button" 
                          onClick={() => removeSkill(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                  </div>
                </div>
                
                {/* Achievements section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Achievements</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {form.getValues('achievements')?.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary rounded-lg p-2">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{achievement.title}</span>
                            <span className="text-sm text-primary">{achievement.value}</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAchievement(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={newAchievementTitle}
                      onChange={(e) => setNewAchievementTitle(e.target.value)}
                      placeholder="Title"
                      className="col-span-2"
                    />
                    <Input
                      value={newAchievementValue}
                      onChange={(e) => setNewAchievementValue(e.target.value)}
                      placeholder="Value"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addAchievement}
                      className="col-span-3"
                    >
                      Add Achievement
                    </Button>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {form.getValues('id') ? 'Update Experience' : 'Add Experience'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="work">
        <TabsList>
          <TabsTrigger value="work" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4" />
            Work Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="work" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : workExperiences.length > 0 ? (
                <div className="space-y-6">
                  {workExperiences.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BriefcaseIcon className="h-4 w-4 text-primary" />
                            {exp.title}
                          </h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <div className="flex gap-3 text-sm mt-1">
                            <span>{exp.location}</span>
                            {exp.date && <span>•</span>}
                            <span>{exp.date}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(exp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(exp.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        {exp.description.length > 150 
                          ? `${exp.description.substring(0, 150)}...` 
                          : exp.description
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No work experiences added yet. Click "Add Experience" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="education" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : educationExperiences.length > 0 ? (
                <div className="space-y-6">
                  {educationExperiences.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            {exp.title}
                          </h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <div className="flex gap-3 text-sm mt-1">
                            <span>{exp.location}</span>
                            {exp.date && <span>•</span>}
                            <span>{exp.date}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(exp)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(exp.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        {exp.description.length > 150 
                          ? `${exp.description.substring(0, 150)}...` 
                          : exp.description
                        }
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No education entries added yet. Click "Add Experience" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExperienceManager;
