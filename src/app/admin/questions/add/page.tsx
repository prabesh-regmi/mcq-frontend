import QuestionForm from "@/components/question/QuestionForm";
import BulkUpload from "@/components/question/BulkUpload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BackButton from "@/components/ui/back-button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function AddQuestionPage() {
  return (
    <div className="space-y-2">
      <BackButton />
      <Tabs defaultValue="single" className="w-full">
        <TabsList>
          <TabsTrigger value="single">Single Create</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-left">Add Question</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk">
          <BulkUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}
