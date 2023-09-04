"use client";

import React from 'react'
import Image from 'next/image';
import { X } from 'lucide-react';

import { UploadDropzone } from '@/lib/uploadthing';

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: "messageFile" | "serverImage";
}

const imageTypes = ["jpg", "png", "webp"];

function FileUpload({
  value, onChange, endpoint
}: FileUploadProps) {
  const fileType = value?.split(".").pop();

  const onButtonClick = async () => {
    const stringArray = value.split("/");
    fetch(`/api/uploadthing`, {
      method: "DELETE",
      body: JSON.stringify({ fileName: stringArray[stringArray.length - 1] })
    }).then(async (res) => {
      if (res.ok) return await res.json();

      return null;
    })

    return onChange("");
  }

  if (value && fileType && imageTypes.includes(fileType)) return (
    <div className='relative h-20 w-20'>
      <Image src={value} alt='Server Image' className='rounded-full' fill />

      <button type='button'
        onClick={onButtonClick}
        className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );

  return (
    <UploadDropzone endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => console.log(error)}
    />
  )
}

export default FileUpload