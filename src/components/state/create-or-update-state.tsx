import { useStateMutation, useUpdateStateMutation } from '@/api/data/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form';
import 'react-quill-new/dist/quill.snow.css';
import { State } from '@/types';
import { useRouter } from 'next/router';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface StateProps {
 initialValues?: State;
}

const CreateOrUpdateForm = ({ initialValues }: StateProps) => {
 const router = useRouter();

 const { mutate: createState, isPending: isCreating } = useStateMutation();
 const { mutate: updateState, isPending: isUpdating } =
  useUpdateStateMutation();
 const formSchema = z.object({
  name: z.string(),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  description: z.string(),
 });

 type FormFields = z.infer<typeof formSchema>;

 const form = useForm<FormFields>({
  defaultValues: initialValues
   ? {
      name: initialValues.name,
      lat: initialValues.location.coordinates[0],
      lon: initialValues.location.coordinates[1],
      description: initialValues.description,
     }
   : {},
  resolver: zodResolver(formSchema),
 });

 const onSubmit = (values: FormFields) => {
  const input = {
   name: values.name,
   description: values.description,
   location: {
    type: 'Point',
    coordinates: [values.lat, values.lon],
   },
   url: 'https://www.california.com',
  };

  if (!initialValues) {
   createState(input);
  } else {
   updateState({
    id: initialValues?.id,
    ...input,
   });
  }

  router.push('/state');
 };

 return (
  <div className='container mx-auto py-10'>
   <Form {...form}>
    <form
     onSubmit={form.handleSubmit(onSubmit)}
     className='flex w-full max-w-md flex-col gap-4'
    >
     <FormField
      control={form.control}
      name='name'
      render={({ field }) => {
       return (
        <FormItem>
         <FormLabel className='pb-4'>Name</FormLabel>
         <FormControl>
          <Input placeholder='Enter the name' type='text' {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       );
      }}
     />

     <FormField
      control={form.control}
      name='lat'
      render={({ field }) => (
       <FormItem>
        <FormLabel>Langitude</FormLabel>
        <FormControl>
         <Input placeholder='Enter the lat' type='numeric' {...field} />
        </FormControl>
        <FormMessage />
       </FormItem>
      )}
     />

     <FormField
      control={form.control}
      name='lon'
      render={({ field }) => (
       <FormItem>
        <FormLabel>Longitude</FormLabel>
        <FormControl>
         <Input placeholder='Enter the lon' type='numeric' {...field} />
        </FormControl>
        <FormMessage />
       </FormItem>
      )}
     />

     <ReactQuill
      theme='snow'
      value={form.getValues('description')}
      onChange={(value) => form.setValue('description', value)}
     />

     <Button
      type='submit'
      className='w-full'
      disabled={isCreating || isUpdating}
     >
      Submit
     </Button>
    </form>
   </Form>
  </div>
 );
};

export default CreateOrUpdateForm;
