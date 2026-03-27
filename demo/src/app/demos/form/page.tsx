'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const formSchema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符'),
  email: z.string().email('请输入有效的邮箱'),
  role: z.enum(['frontend', 'backend', 'fullstack'], {
    required_error: '请选择角色',
  }),
  experience: z.number().min(1, '至少 1 年').max(20, '最多 20 年'),
  bio: z.string().max(200, '最多 200 字符').optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function FormDemo() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      experience: 3,
      bio: '',
    },
  })

  function onSubmit(values: FormValues) {
    setSubmitted(values)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:text-primary mb-8 block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">表单演示</h1>
      <p className="text-muted-foreground mb-8">
        React Hook Form + Zod — 类型安全的表单验证
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 姓名 */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            姓名
          </label>
          <input
            id="name"
            {...register('name')}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors.name && 'border-destructive'
            )}
            placeholder="请输入姓名"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* 邮箱 */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors.email && 'border-destructive'
            )}
            placeholder="请输入邮箱"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* 角色 */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            角色
          </label>
          <select
            id="role"
            {...register('role')}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors.role && 'border-destructive'
            )}
          >
            <option value="">请选择</option>
            <option value="frontend">前端工程师</option>
            <option value="backend">后端工程师</option>
            <option value="fullstack">全栈工程师</option>
          </select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role.message}</p>
          )}
        </div>

        {/* 经验年限 */}
        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium">
            经验年限
          </label>
          <input
            id="experience"
            type="number"
            {...register('experience', { valueAsNumber: true })}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors.experience && 'border-destructive'
            )}
          />
          {errors.experience && (
            <p className="text-sm text-destructive">{errors.experience.message}</p>
          )}
        </div>

        {/* 简介 */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            简介（可选）
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={3}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              errors.bio && 'border-destructive'
            )}
            placeholder="介绍一下自己..."
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            提交
          </button>
          <button
            type="button"
            onClick={() => { reset(); setSubmitted(null) }}
            className="rounded-md border px-4 py-2 text-sm hover:bg-secondary"
          >
            重置
          </button>
        </div>
      </form>

      {submitted && (
        <div className="mt-8 rounded-lg bg-green-50 border border-green-200 p-4">
          <h3 className="font-medium text-green-800 mb-2">提交成功</h3>
          <pre className="text-sm text-green-700">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
