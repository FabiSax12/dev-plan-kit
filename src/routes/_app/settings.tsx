import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm'
import { EditProfileInformationForm } from '@/components/settings/EditProfileInformationForm'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <EditProfileInformationForm />
      <ChangePasswordForm />
      <PreferencesSection />
    </div>
  )
}
