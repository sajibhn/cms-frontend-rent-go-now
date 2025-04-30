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
import { CreateUnitInput, Unit } from '@/types';
import { useRouter } from 'next/router';
import { useUnitMutation, useUpdateUnitMutation } from '@/api/data/units';
import { useState } from 'react';
import { useApartmentsQuery } from '@/api/data/apartments';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { amenities, facilities } from '@/utils/constant';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { MediaUploader } from '../reusable/MediaUploader';
import { useEffect } from 'react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface UnitProps {
  initialValues?: Unit;
}

type OptionType = {
  value: string;
  label: string;
};

const amenityOptions: OptionType[] = amenities.map(amenity => ({
  value: amenity,
  label: amenity
}));

const facilitiesOption: OptionType[] = facilities.map(facility => ({
  value: facility,
  label: facility
}));


const UnitCreateOrUpdateForm = ({ initialValues }: UnitProps) => {

  const router = useRouter();
   const [apartment, setApartment] = useState<string>(initialValues?.apartment?.name ?? '');

   const  {data, loading} = useApartmentsQuery(
     {
       name: apartment,
     },
     {
       enabled: !!apartment,
     }
   );

  const { mutate: createUnit, isPending: isCreating } = useUnitMutation();
  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnitMutation();

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bedrooms: z.coerce.number().int().positive("Must be at least 1"),
    bathrooms: z.coerce.number().positive("Must be at least 1"),
    floorArea: z.coerce.number().positive("Must be positive"),
    price: z.coerce.number().positive("Must be positive"),
    minLeaseMonths: z.coerce.number().int().positive(),
    minRentPeriod: z.coerce.number().int().positive(),
    contact: z.string().min(1, "Contact info required"),
    amenities: z.array(z.string()).min(1, "At least one amenity required"),
    facilities: z.array(z.string()).min(1, "At least one amenity required"),
    isFullyFurnished: z.boolean(),
    description: z.string().optional(),
    apartmentId: z.string().uuid("Invalid apartment ID"),
    media: z.array(z.string().url("Media URLs must be valid URLs"))
      .min(1, "At least one media file is required"),
  });

  type FormFields = z.infer<typeof formSchema>;

  const form = useForm<FormFields>({
    defaultValues: initialValues ? {
      ...initialValues,
      apartmentId: initialValues.apartment?.id,
      amenities: initialValues.amenities.split(',').map(a => a.trim()),
      facilities: initialValues.facilities.split(',').map(a => a.trim()),
      media: initialValues.media || [],
    } : {
        media: []
    },
    resolver: zodResolver(formSchema),
  });

    useEffect(() => {
      if (initialValues) {
        form.reset({
          ...initialValues,
          apartmentId: initialValues.apartment?.id,
          amenities: initialValues.amenities.split(',').map(a => a.trim()),
          facilities: initialValues.facilities.split(',').map(a => a.trim()),
          media: initialValues.media || [],
        });
      }
    }, [initialValues, form]);

  const onSubmit = (values: FormFields) => {
    const unitData: CreateUnitInput = {
      ...values,
      amenities: values.amenities.join(', '),
      facilities: values.facilities.join(', '),
      apartmentId: values.apartmentId,
      media: values.media,
    };

    if (!initialValues) {
      createUnit(unitData);
    } else {
      updateUnit({
        id: initialValues.id,
        ...unitData
      });
    }

    router.push('/units');
  };

  return (
    <div className='container mx-auto py-10'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full max-w-2xl flex-col gap-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Unit 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='apartmentId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Apartment</FormLabel>
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
                            ? data.find((apartment) => apartment.id === field.value)?.name
                            : 'Select Apartment'}
                          <ChevronsUpDown className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder='Search Neighborhood...'
                          className='h-9'
                          onInput={(e) => setApartment(e.currentTarget.value)}
                        />
                        <CommandList>
                          <CommandEmpty>{loading ? 'loading' : 'No data found'}</CommandEmpty>
                          <CommandGroup>
                            {data.map((apartment) => (
                              <CommandItem
                                value={apartment.name}
                                key={apartment.id}
                                onSelect={() => {
                                  form.setValue('apartmentId', apartment.id);
                                }}
                              >
                                {apartment.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    apartment.id === field.value ? 'opacity-100' : 'opacity-0'
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

            {/* Numeric Fields */}
            <FormField
              control={form.control}
              name='bedrooms'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bathrooms'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.5" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='floorArea'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Area (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='minLeaseMonths'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Lease (Months)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='minRentPeriod'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Rent Period (Months)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact */}
            <FormField
              control={form.control}
              name='contact'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkbox */}
            <FormField
              control={form.control}
              name='isFullyFurnished'
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel>Fully Furnished</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Amenities & Facilities */}

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Select
                    options={amenityOptions}
                    isMulti
                    value={amenityOptions.filter(option =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) =>
                      field.onChange(selected.map(option => option.value))
                    }
                    closeMenuOnSelect={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="facilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facilities</FormLabel>
                <FormControl>
                  <Select
                    options={facilitiesOption}
                    isMulti
                    value={facilitiesOption.filter(option =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) =>
                      field.onChange(selected.map(option => option.value))
                    }
                    closeMenuOnSelect={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Editor */}
          <div className='mt-4'>
            <FormLabel>Description</FormLabel>
            <ReactQuill
              theme='snow'
              value={form.getValues('description') || ''}
              onChange={(value) => form.setValue('description', value)}
              className='bg-white'
            />
          </div>

          <Button
            type='submit'
            className='w-full mt-6'
            disabled={isCreating || isUpdating}
          >
            {initialValues ? 'Update Unit' : 'Create Unit'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UnitCreateOrUpdateForm;