'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Eye, EyeSlash, Spinner } from '@/lib/icons'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    } else {
      toast.success('Đăng nhập thành công!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          className="w-full h-11 px-4 rounded-lg border border-border bg-bg-surface focus:border-teal outline-none transition-all placeholder:text-text-muted text-sm"
        />
        {errors.email && <p className="text-xs text-coral">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-text-secondary">Mật khẩu</label>
          <button type="button" className="text-xs text-teal hover:underline">Quên mật khẩu?</button>
        </div>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-11 px-4 rounded-lg border border-border bg-bg-surface focus:border-teal outline-none transition-all placeholder:text-text-muted text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
          >
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-coral">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-teal hover:bg-teal-dark text-bg-primary font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
      >
        {isLoading && <Spinner size={18} className="animate-spin" />}
        Đăng nhập
      </button>
    </form>
  )
}
