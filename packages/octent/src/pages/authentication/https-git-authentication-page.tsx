import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

const httpsAuthFormSchema = z.object({
  username: z.string(),
  password: z.string(),
})
type HttpsAuthFormValues = z.infer<typeof httpsAuthFormSchema>

export function HttpsGitAuthenticationPage() {
  const authenticate = useAuth(state => state.authenticate)
  const form = useForm<HttpsAuthFormValues>({
    resolver: zodResolver(httpsAuthFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = useCallback((values: HttpsAuthFormValues) => {
    authenticate({
      type: 'http',
      username: values.username,
      password: values.password,
    })
  }, [authenticate])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card>
        <CardHeader>
          <CardTitle>Fill your login information</CardTitle>
          <CardDescription>
            Octent will use the provided information to authenticate you and
            update your repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your username is the one you use to connect to your
                      repository.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your password is the one you use to connect to your
                      repository.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
