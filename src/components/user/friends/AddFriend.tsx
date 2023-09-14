"use client";

import React from 'react'
import axios from 'axios';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import qs from "query-string";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required."
    })
});

type AddFriendProps = {
    serverId: string;
}

export default function AddFriend({
    serverId
}: AddFriendProps) {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ""
        }
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/users/friendRequest",
                query: { serverId }
            })
            await axios.post(url, values);

            form.reset();
            router.push(`/channels/${serverId}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='h-full w-full flex flex-col items-center mt-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full items-center p-2'>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-600 dark:text-white"
                                >
                                    Add Friend
                                </FormLabel>

                                <div className='flex gap-x-4'>
                                    <div>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-500 dark:bg-zinc-800 text-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="Enter username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>

                                    <Button disabled={isLoading} variant="primary">
                                        Send friend request
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />

                </form>
            </Form>
        </div>
    )
}