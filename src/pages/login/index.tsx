import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import Otp from "@/components/login/otp"
import { useOtpMutation } from "@/api/data/user"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address"
  })
})

type FormFields = z.infer<typeof formSchema>

const Index = () => {
  const [showEmailForm, setShowEmailForm] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('')

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema)
  });

  const { mutate } = useOtpMutation();

  const onSubmit = (values: FormFields) => {

    mutate(values, {
      onSuccess: () => {
        setUserEmail(values.email);
        setShowEmailForm(false);
      }
    });

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {showEmailForm ? (
        <>
          <Form
            {...form}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-md w-full flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="block text-center">Enter your email below to recieve an otp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </>) : (
          <Otp userEmail={userEmail}/>
      )}
    </main>
  )
}

export default Index;