import { createServerFn } from "@tanstack/react-start";
import type { Provider } from '@supabase/supabase-js';
import { getSupabaseServerClient } from "@/lib/supabase.server";
import z from "zod";
import { redirect } from "@tanstack/react-router";

export const signUpWithEmailAndPassword = createServerFn({
  method: 'POST'
}).inputValidator(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
    callbackUrl: z.string(),
  })
).handler(async ({ data }) => {
  const supabase = getSupabaseServerClient();
  console.log('Signing up user with email:', data.email);

  const {data: signUpData, error} = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: data.callbackUrl,
    }
  });

  console.log('Sign up response:', signUpData, error);

  if (error) {
    throw new Error(error.message)
  }

  return signUpData;
});

export const signInWithEmailAndPassword = createServerFn({
  method: 'POST'
}).inputValidator(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
).handler(async ({ data }) => {
  const supabase = getSupabaseServerClient();

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return signInData;
});

export const signInWithOAuth = createServerFn({ 
    method: 'POST' 
}).inputValidator(
    (data: { provider: Provider; redirectTo: string }) => data
).handler(async ({ data }) => {
    
    const supabase = getSupabaseServerClient();

    const { provider, redirectTo } = data;
    const { data: authData, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
            scopes: 'email profile',
            queryParams: {
                prompt: 'select_account',
                access_type: 'offline',
            }
        },
    });

    if (error) {
    throw new Error(error.message)
  }

  return authData.url;
});

export const exchangeCodeForSession = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ 
      code: z.string() 
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(data.code)

    if (error) {
      console.error('Error exchanging code:', error)
      throw redirect({ to: '/login' })
    }

    return { user: sessionData.user }
  });


export const resetPassword = createServerFn({ method: 'POST' })
.inputValidator(z.object({ 
  email: z.string().email(),
  redirectTo: z.string().optional(),
}))
.handler(async ({ data }) => {
  const supabase = getSupabaseServerClient();

  const response = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: data.redirectTo,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  console.log("Password reseted for email: ", data.email)
})

export const changePassword = createServerFn({ method: 'POST' })
.inputValidator(z.object({ 
  password: z.string().min(8),
  redirectTo: z.string().optional(),
}))
.handler(async ({ data }) => {
  const supabase = getSupabaseServerClient();

  const response = await supabase.auth.updateUser({
    password: data.password,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  console.log("Password changed", response.data)

  return response.data;
})