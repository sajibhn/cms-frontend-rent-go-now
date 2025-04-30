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
import { Apartments } from '@/types';
import { useRouter } from 'next/router';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useState, useEffect } from 'react';
import { useNeighborhoodsQuery } from '@/api/data/neighborhood';
import { useApartmentMutation, useUpdateApartmentsMutation } from '@/api/data/apartments';
import { MediaUploader } from '../reusable/MediaUploader';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ApartmentsProps {
  initialValues?: Apartments;
}

const CreateOrUpdateForm = ({ initialValues }: ApartmentsProps) => {
  const router = useRouter();
  const [neighborhood, setNeighborhood] = useState<string>(
    initialValues?.neighborhood?.name ?? ''
  );

  const { data, loading } = useNeighborhoodsQuery(
    { name: neighborhood },
    { enabled: !!neighborhood }
  );

  const { mutate: createApartment, isPending: isCreating } = useApartmentMutation();
  const { mutate: updateApartment, isPending: isUpdating } = useUpdateApartmentsMutation();

  const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    description: z.string().min(1, 'Description is required'),
    neighborhoodId: z.string({
      required_error: 'Please select a neighborhood to display.',
    }),
    media: z.array(z.string().url("Media URLs must be valid URLs"))
      .min(1, "At least one media file is required"),
  });

  type FormFields = z.infer<typeof formSchema>;

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
      name: initialValues.name,
      address: initialValues.address,
      lat: initialValues.location?.coordinates?.[0] || 0,
      lon: initialValues.location?.coordinates?.[1] || 0,
      description: initialValues.description,
      neighborhoodId: initialValues.neighborhood.id,
      media: initialValues.media || [],
    } : {
      media: []
    }
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name,
        address: initialValues.address,
        lat: initialValues.location.coordinates[0],
        lon: initialValues.location.coordinates[1],
        description: initialValues.description,
        neighborhoodId: initialValues.neighborhood.id,
        media: initialValues.media || [],
      });
    }
  }, [initialValues, form]);

  const onSubmit = (values: FormFields) => {
    const input = {
      name: values.name,
      address: values.address,
      description: values.description,
      location: {
        type: 'Point',
        coordinates: [values.lat, values.lon],
      },
      url: 'https://www.california.com',
      neighborhoodId: values.neighborhoodId,
      media: values.media,
    };

    if (!initialValues) {
      createApartment(input);
    } else {
      updateApartment({
        id: initialValues.id,
        ...input
      });
    }

    router.push('/apartments');
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
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder='Enter address' {...field} />
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
                    onChange={field.onChange}
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

          <FormField
            control={form.control}
            name='neighborhoodId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Neighborhood</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? data?.find(n => n.id === field.value)?.name
                          : 'Select Neighborhood'}
                        <ChevronsUpDown className='opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder='Search Neighborhood...'
                        className='h-9'
                        onInput={(e) => setNeighborhood(e.currentTarget.value)}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {loading ? 'Loading...' : 'No neighborhoods found'}
                        </CommandEmpty>
                        <CommandGroup>
                          {data?.map((neighborhood) => (
                            <CommandItem
                              key={neighborhood.id}
                              value={neighborhood.name}
                              onSelect={() => form.setValue('neighborhoodId', neighborhood.id)}
                            >
                              {neighborhood.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  neighborhood.id === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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