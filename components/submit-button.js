'use client';

import { useForm } from 'react-hook-form';

export default function SubmitButton({text}){
    const { formState:  {isSubmitting}  } = useForm();

    return(
        <button disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : text }
        </button>
    )
}