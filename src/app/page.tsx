
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wand2, User, Bot, Loader2, Heart, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form as ShadcnForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { calculateNumerologyProfile, type NumerologyProfile } from "@/lib/numerology";
import { getReading, getCompatibility } from "./actions";

const detailsSchema = z.object({
  name: z.string().min(2, { message: "Please enter your full name." }),
  dob: z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: "Please enter a valid date in MM/DD/YYYY format.",
  }),
});
type DetailsFormValues = z.infer<typeof detailsSchema>;

const compatibilitySchema = z.object({
  partnerName: z.string().min(2, { message: "Please enter your partner's full name." }),
  partnerDob: z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: "Please enter a valid date in MM/DD/YYYY format.",
  }),
});
type CompatibilityFormValues = z.infer<typeof compatibilitySchema>;

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

type UserDetails = {
  name: string;
  dob: string;
  profile: NumerologyProfile;
};

const exampleQuestions = [
  "What is my Life Path number and what does it reveal about me?",
  "Analyze my name to find my Destiny number.",
  "What career paths are best suited for my numerological profile?",
  "How can I better understand my life's mission and purpose?",
  "Check the numerological compatibility between me and my partner.",
];

const compatibilityQuestion = exampleQuestions[4];

export default function Home() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isCompatibilityDialogOpen, setCompatibilityDialogOpen] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const detailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: "", dob: "" },
  });

  const compatibilityForm = useForm<CompatibilityFormValues>({
    resolver: zodResolver(compatibilitySchema),
    defaultValues: { partnerName: "", partnerDob: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleDetailsSubmit = (values: DetailsFormValues) => {
    try {
      const profile = calculateNumerologyProfile(values.name, values.dob);
      setUserDetails({ ...values, profile });
      setMessages([
        {
          id: "intro",
          role: "assistant",
          content: `Hello, ${values.name}. I have received your information. I am Numa, an expert numerologist ready to answer your questions. What would you like to explore first?`,
        },
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Calculating Profile",
        description: "Please ensure your date of birth is correct.",
      });
    }
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    processQuestion(input);
  };

  const processQuestion = async (question: string) => {
    if (!userDetails) return;

    if (question === compatibilityQuestion) {
      setCompatibilityDialogOpen(true);
      return;
    }

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: question };
    const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: "", isLoading: true };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      const answer = await getReading({
        fullName: userDetails.name,
        dateOfBirth: userDetails.dob,
        question,
        ...userDetails.profile,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, content: answer, isLoading: false } : msg
        )
      );
    } catch (error) {
      const errorMessage = "I apologize, but I encountered an issue generating your reading. Could you please try rephrasing your question?";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, content: errorMessage, isLoading: false } : msg
        )
      );
    }
  };

  const handleCompatibilitySubmit = async (values: CompatibilityFormValues) => {
    if (!userDetails) return;
    setCompatibilityDialogOpen(false);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: `Please analyze my compatibility with ${values.partnerName}.`,
    };
    const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: "", isLoading: true };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    try {
      const result = await getCompatibility({
        userFullName: userDetails.name,
        userDateOfBirth: userDetails.dob,
        partnerFullName: values.partnerName,
        partnerDateOfBirth: values.partnerDob,
      });
      const fullResponse = `${result.analysis}\n\n${result.followUpQuestion}`;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, content: fullResponse, isLoading: false } : msg
        )
      );
    } catch (error) {
       const errorMessage = "I seem to be having trouble connecting with the cosmos for this compatibility reading. Could you please check the details and try again?";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, content: errorMessage, isLoading: false } : msg
        )
      );
    }
    compatibilityForm.reset();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      {!userDetails ? (
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wand2 className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="font-headline text-3xl">NumaWise</CardTitle>
            <CardDescription className="pt-2">
              Hello, my name is Numa. I am an expert numerologist ready to answer your questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShadcnForm {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-4">
                <FormField
                  control={detailsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="As on your birth certificate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Date of Birth</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/DD/YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={detailsForm.formState.isSubmitting}>
                  Start Your Journey
                </Button>
              </form>
            </ShadcnForm>
          </CardContent>
        </Card>
      ) : (
        <div className="flex h-screen w-full max-w-3xl flex-col">
          <header className="border-b p-4 text-center">
            <h1 className="font-headline text-2xl text-accent">NumaWise</h1>
            <p className="text-sm text-muted-foreground">Your Personal AI Numerologist</p>
          </header>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex items-start gap-3", message.role === "user" && "justify-end")}>
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div className={cn("max-w-md rounded-lg p-3", message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : (
                       <ReactMarkdown className="prose prose-sm dark:prose-invert prose-p:leading-relaxed">
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t bg-background p-4">
            <div className="mb-4">
              <p className="mb-2 text-sm text-center text-muted-foreground">Here are some popular questions to get you started:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQuestions.map((q) => (
                  <Button key={q} variant="outline" size="sm" className="text-left justify-start h-auto whitespace-normal" onClick={() => processQuestion(q)}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Numa a question..."
                className="flex-1"
                aria-label="Chat input"
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <Dialog open={isCompatibilityDialogOpen} onOpenChange={setCompatibilityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Compatibility Check</DialogTitle>
            <DialogDescription>Enter your partner's details to analyze your numerological compatibility.</DialogDescription>
          </DialogHeader>
          <ShadcnForm {...compatibilityForm}>
            <form onSubmit={compatibilityForm.handleSubmit(handleCompatibilitySubmit)} className="space-y-4 py-4">
              <FormField
                control={compatibilityForm.control}
                name="partnerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner's Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="As on their birth certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={compatibilityForm.control}
                name="partnerDob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner's Date of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/DD/YYYY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" variant="default" disabled={compatibilityForm.formState.isSubmitting}>
                  <Heart className="mr-2 h-4 w-4" />
                  Analyze Compatibility
                </Button>
              </DialogFooter>
            </form>
          </ShadcnForm>
        </DialogContent>
      </Dialog>
    </main>
  );
}
