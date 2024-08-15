"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTodo } from "@/use-cases/todos";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTodoForm() {
  const formSchema = z.object({
    title: z.string().min(1),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  function onSubmit(data: FormValues) {
    createTodo({
      title: data.title,
    });
    form.reset();
  }
  const isSubmitDisabled = () => {
    const modifiedFields = Object.keys(form.formState.dirtyFields);
    return modifiedFields.length === 0 || !form.formState.isValid;
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center mb-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 mr-2">
                {/* <FormLabel>Title</FormLabel> */}
                <FormControl>
                  <Input
                    className="bg-muted text-muted-foreground rounded-md px-3 py-2"
                    placeholder="Title"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                    Enter the title of the todo item
                  </FormDescription> */}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <Button disabled={isSubmitDisabled()} type="submit">
            Submit
          </Button>
        </div>
        <div>
          {form.formState.errors.title && (
            <FormMessage>{form.formState.errors.title.message}</FormMessage>
          )}
        </div>
      </form>
    </Form>
  );
}
