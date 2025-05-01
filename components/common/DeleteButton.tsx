'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
    slug: string;
  }

export default function DeleteButton({ slug }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/recipe/${slug}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.push('/meals');  // 삭제 후 다른 페이지로 리디렉션
            } else {
                console.error('Failed to delete the recipe');
            }
        } catch (error) {
            console.error('Error deleting the recipe:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}
