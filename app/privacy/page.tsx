// app/privacy/page.tsx
export const metadata = { title: 'Chính sách bảo mật | ChipCraft' }

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 40px', zIndex: 50,
      }}>
        <a href="/" style={{ fontFamily: '"DM Mono"', fontWeight: 700, fontSize: 18, color: '#E2E8F0', textDecoration: 'none' }}>
           ChipCraft
        </a>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '104px 40px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: '"DM Mono"', fontSize: 11, color: '#00D4B4', letterSpacing: '0.1em', marginBottom: 12 }}>
            CẬP NHẬT LẦN CUỐI: 17/03/2025
          </div>
          <h1 style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 800, fontSize: 44, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Chính sách bảo mật
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            ChipCraft cam kết bảo vệ quyền riêng tư của bạn. Tài liệu này mô tả cách chúng tôi
            thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
          </p>
        </div>

        {[
          {
            title: '1. Thông tin chúng tôi thu thập',
            content: `**Thông tin bạn cung cấp:**
 Họ tên, địa chỉ email khi đăng ký
 Thông tin thanh toán (xử lý bởi Stripe - chúng tôi không lưu trữ số thẻ)
 Nội dung chat với AI Tutor
 Kết quả quiz và lab submissions

**Thông tin tự động thu thập:**
 Dữ liệu sử dụng: thời gian học, bài học đã hoàn thành, tiến độ
 Thông tin thiết bị: loại trình duyệt, hệ điều hành, địa chỉ IP
 Cookies và local storage để duy trì phiên đăng nhập và cài đặt giao diện`,
          },
          {
            title: '2. Cách chúng tôi sử dụng thông tin',
            content: ` Cung cấp và cải thiện dịch vụ giáo dục
 Cá nhân hóa lộ trình học tập và gợi ý bài học
 Xử lý thanh toán và gửi hóa đơn
 Gửi thông báo quan trọng về tài khoản và khóa học (qua email)
 Phân tích dữ liệu ẩn danh để nâng cao chất lượng nội dung
 Tuân thủ nghĩa vụ pháp lý

Chúng tôi **không** bán dữ liệu cá nhân của bạn cho bên thứ ba.`,
          },
          {
            title: '3. Chia sẻ thông tin',
            content: `Chúng tôi chỉ chia sẻ thông tin với:

 **Nhà cung cấp dịch vụ đáng tin cậy**: Supabase (database), Stripe (thanh toán), Google (AI Gemini, OAuth), Vercel (hosting) - tất cả đều có hợp đồng bảo mật dữ liệu.

 **Cơ quan pháp luật**: Khi được yêu cầu bởi luật pháp hoặc lệnh tòa án hợp lệ.

Chúng tôi không chia sẻ thông tin với bên thứ ba cho mục đích quảng cáo.`,
          },
          {
            title: '4. Bảo mật dữ liệu',
            content: ` Tất cả dữ liệu được mã hoá khi truyền (HTTPS/TLS 1.3)
 Database được mã hoá at-rest với AES-256
 Mật khẩu được hash với bcrypt (không lưu plaintext)
 Kiểm tra bảo mật định kỳ và cập nhật vá lỗi
 Supabase Row Level Security đảm bảo mỗi người dùng chỉ truy cập dữ liệu của mình
 Backup dữ liệu hàng ngày, lưu trữ 30 ngày`,
          },
          {
            title: '5. Quyền của bạn',
            content: `Bạn có quyền:

 **Truy cập**: Xem toàn bộ dữ liệu cá nhân chúng tôi có về bạn
 **Chỉnh sửa**: Cập nhật thông tin không chính xác trong trang Cài đặt
 **Xóa**: Yêu cầu xóa tài khoản và tất cả dữ liệu liên quan (trong vòng 30 ngày)
 **Xuất**: Tải xuống dữ liệu học tập của bạn ở định dạng JSON/CSV
 **Phản đối**: Từ chối nhận email marketing (mỗi email đều có link hủy đăng ký)

Để thực hiện bất kỳ quyền nào, gửi yêu cầu đến privacy@chipcraft.vn.`,
          },
          {
            title: '6. Cookies',
            content: `Chúng tôi sử dụng:

 **Cookie bắt buộc**: Duy trì phiên đăng nhập (không thể tắt)
 **Cookie chức năng**: Lưu cài đặt giao diện (dark/light mode, ngôn ngữ)
 **Cookie phân tích**: Google Analytics ẩn danh để hiểu cách người dùng sử dụng nền tảng (có thể từ chối)

Bạn có thể quản lý cookie trong cài đặt trình duyệt, nhưng việc tắt cookie bắt buộc có thể ảnh hưởng đến trải nghiệm đăng nhập.`,
          },
          {
            title: '7. Lưu trữ và xóa dữ liệu',
            content: ` Dữ liệu tài khoản active: Lưu trữ vô thời hạn khi tài khoản còn hoạt động
 Sau khi xóa tài khoản: Dữ liệu bị xóa trong vòng 30 ngày (trừ dữ liệu cần thiết cho tuân thủ pháp lý)
 Log hệ thống: Xóa sau 90 ngày
 Dữ liệu thanh toán: Lưu 7 năm theo yêu cầu luật thuế Việt Nam`,
          },
          {
            title: '8. Liên hệ về quyền riêng tư',
            content: `**Data Protection Officer (DPO)**: Nguyễn Văn Khoa
Email: privacy@chipcraft.vn
Phản hồi trong vòng 72 giờ.

Nếu bạn cho rằng quyền riêng tư của mình bị vi phạm, bạn có thể khiếu nại lên Cục An toàn thông tin, Bộ Thông tin và Truyền thông Việt Nam.`,
          },
        ].map((section, i) => (
          <div key={i} style={{
            marginBottom: 40, paddingBottom: 40,
            borderBottom: i < 7 ? '1px solid var(--border)' : 'none',
          }}>
            <h2 style={{
              fontFamily: '"Be Vietnam Pro"', fontWeight: 700, fontSize: 22,
              color: '#E2E8F0', marginBottom: 16, letterSpacing: '-0.01em',
            }}>{section.title}</h2>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
