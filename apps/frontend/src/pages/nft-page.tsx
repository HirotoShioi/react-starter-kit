import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { pageWrapperStyles } from "@/styles/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { BotIcon, CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { experimental_useObject as useObject } from "ai/react";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import ImageUploader from "@/components/image-uploader";

const nftSchema = z.object({
  name: z.string().min(1).describe("Name of the NFT"),
  symbol: z.string().min(1).max(5).describe("Symbol of the NFT"),
  description: z
    .string()
    .min(1)
    .max(100)
    .describe("Description of the NFT. Markdown is supported."),
  external_url: z
    .string()
    .optional()
    .describe("URL of the official page of the NFT"),
  startsAt: z.date().nullable().describe("Start date of the NFT"),
  endsAt: z.date().nullable().describe("End date of the NFT"),
  attributes: z
    .array(
      z.object({
        key: z.string().describe("Key of the attribute"),
        value: z.string().describe("Value of the attribute"),
      }).optional()
    )
    .max(3)
    .optional()
    .describe("Attributes of the NFT"),
  isCoupon: z.boolean().describe("True if the NFT is used as a coupon."),
});
export function NFTPage() {
  type FormValues = z.infer<typeof nftSchema>;
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(nftSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      external_url: "",
      attributes: [
        {
          key: "",
          value: "",
        },
        {
          key: "",
          value: "",
        },
        {
          key: "",
          value: "",
        },
      ],
      startsAt: null,
      endsAt: null,
      isCoupon: false,
    },
  });
  const { object, submit } = useObject({
    api: `${import.meta.env.VITE_API_BASE_PATH}/nft`,
    schema: nftSchema,
    fetch: async (input, init) => {
      const session = await fetchAuthSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }
      const token = session.tokens?.idToken;
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const headers = {
        ...init?.headers,
        Authorization: `Bearer ${token.toString()}`,
      };
      return fetch(input, { ...init, headers });
    },
    initialValue: {
      name: "",
      symbol: "",
      description: "",
      external_url: undefined,
      startsAt: null,
      endsAt: null,
      isCoupon: false,
    },
  });

  useEffect(() => {
    const {
      name,
      symbol,
      external_url,
      description,
      attributes,
      isCoupon,
      startsAt,
      endsAt,
    } = object ?? {};

    const fieldsToUpdate = {
      name: name ?? "",
      symbol: symbol ?? "",
      external_url: external_url ?? "",
      description: description ?? "",
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      attributes: (attributes ?? []).map((attribute) => ({
        key: attribute?.key ?? "",
        value: attribute?.value ?? "",
      })),
      isCoupon: isCoupon ?? false,
    };

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (
        value !== "" &&
        value !== false &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        form.setValue(key as any, value);
      }
    });
  }, [object]);

  const ids = Array.from({ length: 3 }, (_, i) => i);

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  const formatDate = (date: Date) => {
    try {
      return format(date, "yyyy-MM-dd");
    } catch (e) {
      return date.toString();
    }
  };

  const isSubmitDisabled = () => {
    const requiredFields = ["name", "symbol", "description"];
    const isRequiredFieldsFilled = requiredFields.every(
      //@ts-ignore
      (field) => form.getValues(field)
    );
    return !(isRequiredFieldsFilled && imageFile);
  };

  const submitForm = () => {
    const submitButton = document.getElementById("submit-btn");
    if (submitButton) {
      submitButton.click();
    }
  };

  return (
    <>
      <div className={cn(pageWrapperStyles, "space-y-4")}>
        <h1 className="text-2xl">NFT作成フォーム</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>NFT名称</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-muted rounded-md px-3 py-2"
                        placeholder="NFTの名前"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>シンボル</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-muted rounded-md px-3 py-2"
                        placeholder="シンボル"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-muted rounded-md px-3 py-2 resize-none"
                      rows={2}
                      placeholder="NFTの説明"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="external_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>外部URL</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-muted rounded-md px-3 py-2"
                      placeholder="公式ページのURL"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日時</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground bg-muted"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>開始日時</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日時</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground bg-muted"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>終了日時</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormLabel>NFTの属性</FormLabel>
              <div className="space-y-4">
                {ids.map((id) => (
                  <div key={id} className="grid gap-4 grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`attributes.${id}.key`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="bg-muted rounded-md px-3 py-2"
                              placeholder="キー"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`attributes.${id}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="bg-muted rounded-md px-3 py-2"
                              placeholder="値"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="isCoupon"
                render={({ field }) => (
                  <FormItem
                    className="flex gap-2"
                    style={{
                      alignItems: "end",
                    }}
                  >
                    <FormControl>
                      <Checkbox {...field} value={field.value.toString()} />
                    </FormControl>
                    <FormLabel>クーポン</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <ImageUploader onFileChange={setImageFile} />
            </div>
            <button id="submit-btn" type="submit" className="hidden"></button>
          </form>
        </Form>
        <div className="flex justify-between">
          <Button disabled={isSubmitDisabled()} onClick={submitForm}>
            Submit
          </Button>
          <Button variant="ghost" size="icon" onClick={openDialog}>
            <BotIcon size={30} />
          </Button>
        </div>
      </div>
      <AIFormDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onSubmit={(data: string) => submit(data)}
      />
    </>
  );
}

export type AIFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: string) => void;
};

function AIFormDialog({ isOpen, onClose, onSubmit }: AIFormDialogProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const generate = () => {
    const text = textAreaRef.current?.value;
    if (text) {
      onSubmit(text);
    }
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AIによるNFT作成</DialogTitle>
          <DialogDescription>AIを使ってNFTを作成します。</DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            ref={textAreaRef}
            rows={20}
            placeholder="NFTについての説明"
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={generate}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
