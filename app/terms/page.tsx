// app/terms/page.tsx
import Link from 'next/link'

export const metadata = { title: 'Điều khoản dịch vụ | ChipCraft' }

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 40px', zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: '"DM Mono"', fontWeight: 700, fontSize: 18, color: '#E2E8F0', textDecoration: 'none' }}>
           ChipCraft
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '104px 40px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: '"DM Mono"', fontSize: 11, color: '#00D4B4', letterSpacing: '0.1em', marginBottom: 12 }}>
            CẬP NHẬT LẦN CUỐI: 17/03/2025
          </div>
          <h1 style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 800, fontSize: 44, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Điều khoản dịch vụ
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Vui lòng đọc kỹ các điều khoản này trước khi sử dụng nền tảng ChipCraft.
            Bằng cách truy cập hoặc sử dụng dịch vụ, bạn đồng ý bị ràng buộc bởi các điều khoản sau.
          </p>
        </div>

        {[
          {
            title: '1. Giới thiệu và chấp nhận điều khoản',
            content: `ChipCraft ("Chúng tôi", "Công ty") là nền tảng giáo dục trực tuyến chuyên về thiết kế chip, bán dẫn và trí tuệ nhân tạo, được vận hành bởi ChipCraft Education Co., Ltd, đăng ký tại Việt Nam.

Khi tạo tài khoản hoặc sử dụng dịch vụ ChipCraft, bạn ("Người dùng") xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ toàn bộ điều khoản dịch vụ này, cũng như Chính sách bảo mật của chúng tôi.

Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.`,
          },
          {
            title: '2. Dịch vụ cung cấp',
            content: `ChipCraft cung cấp các dịch vụ sau:

 **Khóa học trực tuyến**: Nội dung video, bài giảng văn bản về Verilog, RTL Design, ASIC Design Flow, Verification, FPGA Prototyping và Kiến trúc AI Chip.

 **AI Tutor**: Hệ thống trí tuệ nhân tạo hỗ trợ giải đáp thắc mắc kỹ thuật, powered by Google Gemini. AI Tutor cung cấp thông tin giáo dục và không thay thế tư vấn kỹ thuật chuyên nghiệp.

 **Virtual Lab**: Môi trường mô phỏng chạy Verilog/SystemVerilog trên trình duyệt, sử dụng các công cụ mã nguồn mở (Yosys, iVerilog).

 **Chứng chỉ hoàn thành**: Được cấp sau khi hoàn thành đầy đủ các yêu cầu của khóa học.`,
          },
          {
            title: '3. Tài khoản và bảo mật',
            content: `3.1. Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản, bao gồm mật khẩu và thông tin đăng nhập.

3.2. Bạn không được chia sẻ tài khoản với người khác hoặc cho phép nhiều người sử dụng cùng một tài khoản đăng ký trả phí.

3.3. ChipCraft có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện vi phạm, bao gồm nhưng không giới hạn: chia sẻ tài khoản, sử dụng sai mục đích, hoặc vi phạm quyền sở hữu trí tuệ.

3.4. Bạn phải thông báo ngay cho ChipCraft khi phát hiện truy cập trái phép vào tài khoản của mình qua email support@chipcraft.vn.`,
          },
          {
            title: '4. Thanh toán và hoàn tiền',
            content: `4.1. **Gói miễn phí**: Không yêu cầu thông tin thẻ, có hiệu lực vô thời hạn với các tính năng được liệt kê.

4.2. **Gói Pro**: Thanh toán hàng tháng ($29/tháng ≈ 736,000) hoặc hàng năm ($276/năm ≈ 7,000,000). Giá có thể thay đổi với thông báo trước 30 ngày.

4.3. **Chính sách hoàn tiền**: Trong vòng 7 ngày đầu sử dụng Gói Pro, nếu không hài lòng, bạn có thể yêu cầu hoàn tiền 100% qua email billing@chipcraft.vn. Sau 7 ngày, không áp dụng hoàn tiền.

4.4. **Hủy đăng ký**: Bạn có thể hủy bất cứ lúc nào từ trang Cài đặt > Thanh toán. Gói Pro sẽ tiếp tục hoạt động đến hết chu kỳ thanh toán hiện tại.`,
          },
          {
            title: '5. Sở hữu trí tuệ',
            content: `5.1. Toàn bộ nội dung khóa học, video, bài giảng, code mẫu, và tài liệu trên ChipCraft là tài sản trí tuệ của ChipCraft hoặc các đối tác được cấp phép.

5.2. Bạn được cấp phép sử dụng cá nhân, không độc quyền để truy cập nội dung trong thời gian đăng ký. Bạn không được:
 Sao chép, phân phối hoặc bán nội dung khóa học
 Tạo tài liệu phái sinh từ nội dung của chúng tôi mà không có sự cho phép bằng văn bản
 Sử dụng nội dung cho mục đích thương mại

5.3. Code bạn tự viết trong các bài lab là tài sản của bạn. Tuy nhiên, code mẫu (starter code) và solution code vẫn thuộc quyền sở hữu của ChipCraft.`,
          },
          {
            title: '6. Hành vi bị cấm',
            content: `Khi sử dụng dịch vụ, bạn không được:

 Cố gắng truy cập trái phép vào hệ thống hoặc tài khoản của người dùng khác
 Sử dụng dịch vụ để phân phối malware hoặc nội dung độc hại
 Thực hiện reverse engineering hoặc cố gắng trích xuất mã nguồn của nền tảng
 Sử dụng bot, crawler hoặc automated tools để scrape nội dung
 Quấy rầy, đe dọa hoặc gây hại cho người dùng khác trong cộng đồng
 Vi phạm bất kỳ luật pháp hiện hành nào`,
          },
          {
            title: '7. Giới hạn trách nhiệm',
            content: `7.1. ChipCraft cung cấp dịch vụ "như hiện trạng" (as-is) mà không có bảo đảm về tính liên tục, chính xác hay phù hợp cho mục đích cụ thể.

7.2. ChipCraft không chịu trách nhiệm về: mất dữ liệu do lỗi người dùng, thiệt hại gián tiếp từ việc sử dụng AI Tutor, hoặc quyết định nghề nghiệp dựa trên chứng chỉ của chúng tôi.

7.3. Trách nhiệm tối đa của ChipCraft không vượt quá số tiền bạn đã thanh toán trong 12 tháng gần nhất.`,
          },
          {
            title: '8. Thay đổi điều khoản',
            content: `ChipCraft có thể cập nhật điều khoản này theo thời gian. Chúng tôi sẽ thông báo cho bạn qua email đã đăng ký ít nhất 14 ngày trước khi thay đổi quan trọng có hiệu lực.

Việc tiếp tục sử dụng dịch vụ sau ngày hiệu lực được coi là chấp nhận điều khoản mới.`,
          },
          {
            title: '9. Liên hệ',
            content: `Nếu có câu hỏi về điều khoản này, vui lòng liên hệ:

 Email: legal@chipcraft.vn
 Địa chỉ: Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh
 Giờ làm việc: Thứ Hai - Thứ Sáu, 9:00-17:00 (GMT+7)`,
          },
        ].map((section, i) => (
          <div key={i} style={{
            marginBottom: 40, paddingBottom: 40,
            borderBottom: i < 8 ? '1px solid var(--border)' : 'none',
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
