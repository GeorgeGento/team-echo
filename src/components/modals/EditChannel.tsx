"use client"

import React, { useEffect } from 'react'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ChannelType } from '@prisma/client';
import qs from "query-string";

import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle
} from '../ui/dialog';
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage
} from "../ui/form";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "../ui/select";

import { useModal } from '@/hooks/useModalStore';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(name => name !== "general", { message: "Channel name cannot be 'general" }),
    type: z.nativeEnum(ChannelType)
});

function EditChannelModal() {
    const { isOpen, type, onClose, data } = useModal();
    const isModalOpen = isOpen && type === "editChannel";
    const router = useRouter();
    const { channel, server } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT
        }
    });
    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type);
        }
    }, [form, channel])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: { serverId: server?.id }
            })
            await axios.patch(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Channel type
                                        </FormLabel>

                                        <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className='bg-zinc-300/50 border-0 text-black capitalize outline-none
                                                    ring-offset-0 focus:ring-0 focus:ring-offset-0'
                                                >
                                                    <SelectValue placeholder="Select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem key={type} value={type} className='capitalize'>
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className='bg-gray-400 px-6 py-4'>
                            <Button disabled={isLoading} variant="primary">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditChannelModal