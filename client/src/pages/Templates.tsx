import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mail, MessageSquare, Eye, Save, Sparkles, Trash2, Edit } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Templates() {
  const { user } = useAuth();
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<"email" | "sms">("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);

  const { data: templates = [], refetch: refetchTemplates } = trpc.templates.list.useQuery();

  const createTemplate = trpc.templates.create.useMutation({
    onSuccess: () => {
      toast.success("Template saved successfully");
      // Reset form
      setTemplateName("");
      setSubject("");
      setContent("");
      setEditingTemplateId(null);
      refetchTemplates();
    },
    onError: (error) => {
      toast.error(`Failed to save template: ${error.message}`);
    },
  });

  const deleteTemplate = trpc.templates.delete.useMutation({
    onSuccess: () => {
      toast.success("Template deleted successfully");
      refetchTemplates();
    },
    onError: (error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });

  const loadTemplate = (template: any) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateType(template.type);
    setSubject(template.subject || "");
    setContent(template.content);
    toast.info("Template loaded for editing");
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter template content");
      return;
    }
    if (templateType === "email" && !subject.trim()) {
      toast.error("Please enter a subject line for email templates");
      return;
    }

    const variables = content.match(/\{\{(\w+)\}\}/g)?.map(v => v.replace(/[{}]/g, "")) || [];

    createTemplate.mutate({
      name: templateName,
      type: templateType,
      subject: templateType === "email" ? subject : undefined,
      content,
      variables,
    });
  };

  const renderPreview = () => {
    return content.replace(/\{\{(\w+)\}\}/g, "[$1]");
  };

  const insertVariable = (variable: string) => {
    setContent((prev) => prev + `{{${variable}}}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/tools">
            <Button variant="ghost" className="mb-4">← Back to Tools</Button>
          </Link>
          <h1 className="text-4xl font-bold cyan-shimmer mb-2">Template Builder</h1>
          <p className="text-muted-foreground">Create reusable email and SMS templates</p>
        </div>

        <Card className="glass premium-card border-border/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Create Template</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Welcome Email"
                className="mt-1 bg-background/50 border-border/50"
              />
            </div>

            <div>
              <Label>Template Type</Label>
              <Tabs value={templateType} onValueChange={(v) => setTemplateType(v as "email" | "sms")} className="mt-1">
                <TabsList className="glass">
                  <TabsTrigger value="email">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="sms">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {templateType === "email" && (
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Welcome!"
                  className="mt-1 bg-background/50 border-border/50"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Content</Label>
                <div className="flex gap-1">
                  {["firstName", "lastName", "companyName", "email"].map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable)}
                      className="text-xs"
                    >
                      +{variable}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hi, welcome!"
                rows={12}
                className="mt-1 bg-background/50 border-border/50 font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={handleSave}
                disabled={createTemplate.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createTemplate.isPending ? "Saving..." : "Save Template"}
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>

            {showPreview && (
              <Card className="glass border-border/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-bold">Preview</h3>
                </div>
                <div className="text-sm whitespace-pre-wrap bg-background/30 p-3 rounded">
                  {renderPreview()}
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Saved Templates List */}
        {templates.length > 0 && (
          <Card className="glass premium-card border-border/50 p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Saved Templates</h2>
            </div>

            <div className="grid gap-4">
              {templates.map((template: any) => (
                <Card key={template.id} className="glass border-border/30 p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {template.type === "email" ? (
                          <Mail className="h-4 w-4 text-primary" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-primary" />
                        )}
                        <h3 className="font-bold text-lg">{template.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {template.type.toUpperCase()}
                        </span>
                      </div>
                      {template.subject && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Subject: {template.subject}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                      {template.variables && template.variables.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {template.variables.map((v: string) => (
                            <span key={v} className="text-xs px-2 py-1 rounded glass border border-border/30">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this template?")) {
                            deleteTemplate.mutate({ id: template.id });
                          }
                        }}
                        disabled={deleteTemplate.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
