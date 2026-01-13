import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase.client'
import { useRouteContext, useRouter } from '@tanstack/react-router'

export const ChangePasswordForm = () => {
    const { user } = useRouteContext({ from: "/_app/settings" });
    const router = useRouter();

    const isDisabled = user?.app_metadata.provider !== "email";

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || user.app_metadata.provider !== "email") return;

        const formData = new FormData(e.target as HTMLFormElement);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmNewPassword = formData.get('confirmNewPassword') as string;

        if (newPassword !== confirmNewPassword) {
            console.error('New passwords do not match');
            return;
        }

        const loggedInResponse = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword,
        });

        if (loggedInResponse.error) {
            console.error('Error verifying current password:', loggedInResponse.error.message);
            return;
        }

        const response = await supabase.auth.updateUser({ password: newPassword });

        if (response.error) {
            console.error('Error updating password:', response.error.message);
        }

        await router.invalidate();
        (e.target as HTMLFormElement).reset();
    }

    return <Card>
        <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <form onSubmit={handleChangePassword}>
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name='currentPassword' type="password" disabled={isDisabled} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name='newPassword' type="password" disabled={isDisabled} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" name='confirmNewPassword' type="password" disabled={isDisabled} />
                </div>
                <Button disabled={isDisabled}>Update Password</Button>
            </form>
        </CardContent>
    </Card>
};