'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Eye, EyeSlash, Spinner } from '@/lib/icons'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
    } else {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email.')
      router.push('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-text-secondary">Họ và tên</label>
        <input
          {...register('fullName')}
          placeholder="Nguyễn Văn A"
          className="w-full h-11 px-4 rounded-lg border border-border bg-bg-surface focus:border-teal outline-none transition-all placeholder:text-text-muted text-sm"
        />
        {errors.fullName && <p className="text-xs text-coral">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-secondary">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@company.com"
          className="w-full h-11 px-4 rounded-lg border border-border bg-bg-surface focus:border-teal outline-none transition-all placeholder:text-text-muted text-sm"
        />
        {errors.email && <p className="text-xs text-coral">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-secondary">Mật khẩu</label>
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

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-secondary">Xác nhận mật khẩu</label>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          className="w-full h-11 px-4 rounded-lg border border-border bg-bg-surface focus:border-teal outline-none transition-all placeholder:text-text-muted text-sm"
        />
        {errors.confirmPassword && <p className="text-xs text-coral">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-teal hover:bg-teal-dark text-bg-primary font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
      >
        {isLoading && <Spinner size={18} className="animate-spin" />}
        Đăng ký tài khoản
      </button>
    </form>
  )
}
