import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const aboutSchema = z.object({
  id: z.string().optional(),
  section_key: z.string(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  tags: z.string().min(1, "At least one tag").or(z.string().length(0)),
});

type AboutForm = z.infer<typeof aboutSchema>;

const DEFAULT_TAGS = ["Full-stack", "Web & Mobile", "Cloud Dev", "Problem Solver"];
const DEFAULT_BODY = "Passionate full-stack developer and lifelong learner, focused on impactful results and delivering elegant solutions. I believe in teamwork, growth, and contribution to projects that matter. Outside of coding, I enjoy exploring new tech and creative pursuits.";

export default function AboutWhoAmIManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      section_key: "who_am_i",
      title: "Who Am I?",
      body: DEFAULT_BODY,
      tags: DEFAULT_TAGS.join(", "),
    },
  });

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("about_sections")
        .select("*")
        .eq("section_key", "who_am_i")
        .maybeSingle();
      if (data) {
        form.reset({
          id: data.id,
          section_key: data.section_key,
          title: data.title || "Who Am I?",
          body: data.body || DEFAULT_BODY,
          tags: (data.tags || DEFAULT_TAGS).join(", "),
        });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (values: AboutForm) => {
    setLoading(true);
    const tagArr = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (values.id) {
      // Update
      const { error } = await supabase
        .from("about_sections")
        .update({
          title: values.title,
          body: values.body,
          tags: tagArr,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);
      if (error) {
        toast({
          title: "Error updating section",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Updated", description: "Who Am I? section updated." });
      }
    } else {
      // Insert
      const { error } = await supabase
        .from("about_sections")
        .insert([
          {
            section_key: "who_am_i",
            title: values.title,
            body: values.body,
            tags: tagArr,
            updated_at: new Date().toISOString(),
          },
        ]);
      if (error) {
        toast({
          title: "Error creating section",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Created", description: "Who Am I? section added." });
      }
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage "Who Am I?" Section</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Who Am I?' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea placeholder={DEFAULT_BODY} rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags <span className="text-xs text-muted-foreground">(comma separated)</span></FormLabel>
                  <FormControl>
                    <Input placeholder='Full-stack, Web & Mobile, Cloud Dev, Problem Solver' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Save Section
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
