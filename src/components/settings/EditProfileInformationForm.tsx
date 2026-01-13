import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase.client'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { User } from 'lucide-react'

export const EditProfileInformationForm = () => {
    const { user } = useRouteContext({ from: "/_app/settings" });
    const router = useRouter();

    const isDisabled = user?.app_metadata.provider !== "email";

    const handleChangePersonalDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.app_metadata.provider !== "email") return;

        const formData = new FormData(e.target as HTMLFormElement);
        const fullName = formData.get('name') as string;
        const email = formData.get('email') as string;

        const updatedData = {
            email: email !== user.email ? email : undefined,
            data: {
                full_name: fullName !== user.user_metadata.full_name ? fullName : undefined,
            },
        }

        const response = await supabase.auth.updateUser(updatedData);

        if (response.error) {
            console.error('Error updating user:', response.error.message);
        }

        router.invalidate();
    }

    return <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <form onSubmit={handleChangePersonalDetails} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name='name' disabled={isDisabled} defaultValue={user?.user_metadata.full_name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name='email' type="email" disabled={isDisabled} defaultValue={user?.email} />
                </div>
                <Button type='submit' disabled={isDisabled}>Save Changes</Button>
            </form>
        </CardContent>
    </Card>
};