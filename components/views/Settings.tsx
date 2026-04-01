'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/contexts'

export default function Settings() {
  const { isDark, toggleTheme, language, setLanguage } = useTheme()
  const [email, setEmail] = useState('hoc@chipcraft.vn')
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và ưu tiên của bạn</p>
      </div>

      {/* Appearance */}
      <Card className="bg-card p-6 space-y-4">
        <h2 className="text-xl font-display font-bold">Giao diện</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Chế độ tối</p>
              <p className="text-sm text-muted-foreground">Bật chế độ tối để giảm ánh sáng</p>
            </div>
            <Button
              variant={isDark ? 'default' : 'outline'}
              onClick={toggleTheme}
              size="sm"
            >
              {isDark ? 'Bật' : 'Tắt'}
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <p className="font-semibold mb-2">Ngôn ngữ</p>
            <div className="flex gap-2">
              {(['vi', 'en'] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'outline'}
                  onClick={() => setLanguage(lang)}
                  size="sm"
                >
                  {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="bg-card p-6 space-y-4">
        <h2 className="text-xl font-display font-bold">Tài khoản</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Tên</label>
            <input
              type="text"
              defaultValue="Nguyễn Văn Học"
              className="w-full px-4 py-2 bg-input border border-border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
            <Button variant="outline" size="sm">
              Thay đổi mật khẩu
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-card p-6 space-y-4">
        <h2 className="text-xl font-display font-bold">Thông báo</h2>
        
        <div className="space-y-3">
          {[
            { id: 'email', label: 'Thông báo qua email', checked: true },
            { id: 'progress', label: 'Nhắc nhở tiến độ học', checked: true },
            { id: 'achievements', label: 'Thông báo thành tích', checked: false },
          ].map((notif) => (
            <label key={notif.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={notif.checked}
                className="w-4 h-4"
              />
              <span className="text-sm">{notif.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Subscription */}
      <Card className="bg-primary/10 border-primary p-6 space-y-4">
        <h2 className="text-xl font-display font-bold">Gói đăng ký</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Premium Plan</span>
            <span className="text-primary font-bold">Đang hoạt động</span>
          </div>
          <p className="text-sm text-muted-foreground">Hết hạn trong 15 ngày</p>
          <Button variant="outline">Quản lý gói đăng ký</Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card p-6 space-y-4 border-destructive/20">
        <h2 className="text-xl font-display font-bold text-destructive">Vùng nguy hiểm</h2>
        
        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
          Xóa tài khoản vĩnh viễn
        </Button>
      </Card>
    </div>
  )
}
