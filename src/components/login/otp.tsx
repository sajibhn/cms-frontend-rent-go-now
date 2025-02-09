import {
 InputOTP,
 InputOTPGroup,
 InputOTPSeparator,
 InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
} from '@/components/ui/form';
import { setAuthCredentials } from '@/utils/auth';
import { Routes } from '@/utils/routes';
import { useRouter } from 'next/router';
import { useLoginMutation } from '@/api/data/user';

const formSchema = z.object({
 otp: z.string().min(6, {
  message: 'Your one-time password must be 6 characters.',
 }),
});

const Otp = ({ userEmail }: { userEmail: string }) => {
 const router = useRouter();
 type FormFields = z.infer<typeof formSchema>;
 const form = useForm<FormFields>({
  resolver: zodResolver(formSchema),
 });

 const { mutate } = useLoginMutation();
 const onSubmit = (values: FormFields) => {
  mutate(
   {
    email: userEmail,
    otp: Number(values.otp),
   },
   {
    onSuccess: (data) => {
     const { id, firstName, lastName, email, roles, token, session } =
      data ?? {};
     setAuthCredentials(id, firstName, lastName, email, roles, token, session);

     router.push(Routes.dashboard);
    },
   }
  );
 };

 return (
  <>
   <Form {...form}>
    <form
     onSubmit={form.handleSubmit(onSubmit)}
     className='flex w-full max-w-md flex-col items-center justify-center gap-4'
    >
     <FormLabel className='block text-center text-xl'>Enter the OTP</FormLabel>
     <FormField
      control={form.control}
      name='otp'
      render={({ field }) => (
       <FormItem>
        <FormLabel className='block pb-2 text-center'>
         One-Time Password
        </FormLabel>
        <FormControl>
         <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
           <InputOTPSlot index={0} />
           <InputOTPSlot index={1} />
           <InputOTPSlot index={2} />
           <InputOTPSeparator />
           <InputOTPSlot index={3} />
           <InputOTPSlot index={4} />
           <InputOTPSlot index={5} />
          </InputOTPGroup>
         </InputOTP>
        </FormControl>
       </FormItem>
      )}
     />

     <Button type='submit' className='w-full'>
      Login
     </Button>
    </form>
   </Form>
  </>
 );
};

export default Otp;
