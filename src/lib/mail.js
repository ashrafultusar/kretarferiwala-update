import nodemailer from "nodemailer";

export const sendAdminOrderEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Kretarferiwala" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `নতুন অর্ডার! - #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">নতুন অর্ডার অ্যালার্ট!</h2>
        <p>অর্ডার নম্বর: <strong>#${order.orderNumber}</strong></p>
        <p>গ্রাহক: <strong>${order.name}</strong></p>
        <p>ফোন: <strong>${order.phone}</strong></p>
        <p>ঠিকানা: ${order.address}</p>
        <hr />
        <h3 style="color: #333; margin-top: 15px; margin-bottom: 5px; font-size: 16px;">প্রোডাক্টস:</h3>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 15px;">
          ${order.products?.map(p => `
            <li style="border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px; font-size: 14px;">
              <strong>${p.name}</strong><br />
              <span style="color: #555;">পরিমাণ: ${p.quantity} x ৳${p.discountPrice}</span>
            </li>`).join('') || '<li>কোন প্রোডাক্ট পাওয়া যায়নি</li>'}
        </ul>
        <hr />
        <p>মোট পরিমাণ: <span style="font-size: 18px; color: #e63946; font-weight: bold;">৳${order.totalAmount}</span></p>
        <p>পেমেন্ট মেথড: ${order.paymentMethod}</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard/orders" style="background: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ড্যাশবোর্ড থেকে বিস্তারিত দেখুন</a>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};