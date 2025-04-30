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
import { MediaUploader } from '../reusable/MediaUploader';
import { useEffect } from 'react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface StateProps {
  initialValues?: State;
}


const CreateOrUpdateForm = ({ initialValues }: StateProps) => {

  const router = useRouter();

  const { mutate: createState, isPending: isCreating } = useStateMutation();
  const { mutate: updateState, isPending: isUpdating } = useUpdateStateMutation();

  const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    description: z.string().min(1, 'Description is required'),
    media: z.array(z.string().url("Media URLs must be valid URLs"))
      .min(1, "At least one media file is required"),
  });

  type FormFields = z.infer<typeof formSchema>;

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      lat: initialValues?.location?.coordinates?.[0] || 0,
      lon: initialValues?.location?.coordinates?.[1] || 0,
      description: initialValues?.description || '',
      media: initialValues?.media || [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      console.log('Resetting form with media:', initialValues.media);
      form.reset({
        name: initialValues.name,
        lat: initialValues.location.coordinates[0],
        lon: initialValues.location.coordinates[1],
        description: initialValues.description,
        media: initialValues.media || [],
      });
    }
  }, [initialValues, form]);

  const onSubmit = (values: FormFields) => {
    const input = {
      name: values.name,
      description: values.description,
      location: {
        type: 'Point',
        coordinates: [values.lat, values.lon],
      },
      media: values.media,
      url: 'https://www.california.com',
    };

    if (!initialValues) {
      createState(input);
    } else {
      updateState({
        id: initialValues.id,
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter the name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lat'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
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
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='media'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media</FormLabel>
                <FormControl>
                  <MediaUploader
                    value={field.value}
                    onChange={(urls) => {
                      console.log('MediaUploader onChange:', urls);
                      field.onChange(urls);
                    }}
                    key={initialValues?.id || 'create'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <ReactQuill
                    theme='snow'
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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