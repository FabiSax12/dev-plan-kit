import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '../ui/button';

export const DefaultErrorComponent = ({ error, reset, message }: ErrorComponentProps & { message?: string }) => {
    const router = useRouter();

    return <div className="text-destructive flex flex-col items-center justify-center h-full max-w-1/2 mx-auto text-center">
        {message || 'Error loading page. Please try again later.'}
        <p className='text-muted-foreground text-sm'>Detail: {error.message}</p>
        <div className='flex gap-4'>
            <Button onClick={reset} variant={'default'} className='mt-4'>
                Retry
            </Button>
            <Button onClick={() => router.history.back()} variant={'outline'} className='mt-4'>
                Go Back
            </Button>
        </div>
    </div>
}