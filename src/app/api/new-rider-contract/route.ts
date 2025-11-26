import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files: any[] = [];
        const data: Record<string, string> = {};

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                files.push({ filename: value.name, content: Buffer.from(await value.arrayBuffer()) });
            } else {
                data[key] = value as string;
            }
        }

        const commonHtml = (title: string) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
  .section { margin: 20px 0; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
  .section-title { background: #f3f4f6; padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd; margin: -15px -15px 15px -15px; border-radius: 5px 5px 0 0; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .label { font-weight: bold; color: #666; font-size: 0.9em; }
  .value { font-weight: 500; }
  .terms { background: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 5px; }
  .footer { margin-top: 30px; font-size: 0.8em; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <h2>${title}</h2>
    <p>CONTRACT ACCEPTANCE CONFIRMATION</p>
  </div>

  <p>Dear ${data.firstName} ${data.lastName},</p>
  <p>Thank you for accepting the Freelance Rider Agreement with Shreeji Enterprise Services.</p>

  <div class="section">
    <div class="section-title">RIDER PERSONAL INFORMATION</div>
    <div class="grid">
      <div><div class="label">Full Name</div><div class="value">${data.firstName} ${data.lastName}</div></div>
      <div><div class="label">Father/Mother Name</div><div class="value">${data.parentName}</div></div>
      <div><div class="label">Date of Birth</div><div class="value">${data.dateOfBirth}</div></div>
      <div><div class="label">Email</div><div class="value">${data.email}</div></div>
      <div><div class="label">Mobile Number</div><div class="value">${data.mobileNumber}</div></div>
      <div><div class="label">Parent Mobile</div><div class="value">${data.parentMobile}</div></div>
      <div><div class="label">Aadhar Number</div><div class="value">${data.aadharNumber}</div></div>
      <div><div class="label">PAN Number</div><div class="value">${data.panNumber}</div></div>
    </div>
    <div style="margin-top: 15px;">
      <div class="label">Permanent Address</div><div class="value">${data.permanentAddress}</div>
    </div>
    <div style="margin-top: 10px;">
      <div class="label">Current Address</div><div class="value">${data.currentAddress}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">WORK & VEHICLE INFORMATION</div>
    <div class="grid">
      <div><div class="label">Work Location</div><div class="value">${data.workLocation}</div></div>
      <div><div class="label">Vehicle Type</div><div class="value">${data.vehicleType}</div></div>
      ${data.vehicleType !== 'bike' ? `
      <div><div class="label">Vehicle Number</div><div class="value">${data.vehicleNumber}</div></div>
      <div><div class="label">License Number</div><div class="value">${data.licenseNumber}</div></div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">CONTRACT ACCEPTANCE DETAILS</div>
    <div class="grid">
      <div><div class="label">Date of Acceptance</div><div class="value">${data.acceptanceDate}</div></div>
      <div><div class="label">Location</div><div class="value">${data.signedLocation}</div></div>
    </div>
  </div>

  <div class="terms">
    <h3 style="margin-top: 0; color: #92400e;">KEY CONTRACT TERMS ACCEPTED</h3>
    <ul>
      <li>3-month trial period as independent contractor</li>
      <li>Payment based on orders (₹400-₹3,700/day)</li>
      <li>Zero tolerance for MDND (Marked Delivered Not Delivered)</li>
      <li><strong>Work minimum 6 days/week during trial period</strong></li>
      <li><strong>No medical/accidental death insurance during trial period</strong></li>
      <li><strong>Working as delivery rider at your own risk with full consent</strong></li>
      <li>Insurance benefits apply only after successful trial completion</li>
      <li>Misuse of salary account will result in legal consequences</li>
    </ul>
  </div>

  <div class="section">
    <div class="section-title">NEXT STEPS</div>
    <ol>
      <li>Our HR team will contact you within 2-3 business days</li>
      <li>Please keep your original documents ready for verification</li>
      <li>Ensure your vehicle and license are in valid condition</li>
      <li>Wait for confirmation call/email before starting work</li>
    </ol>
  </div>

  <div class="footer">
    <p><strong>Shreeji Enterprise Services</strong><br>
    Manpower Supply & Recruitment Services<br>
    714 The Spire 2 Shital Park, 150 Feet Ring Road Rajkot, Gujarat - 360005</p>
    <p>Email: info@shreejientserv.in | Phone: +91 73830 60401</p>
  </div>
</body>
</html>`;

        // Email 1: To Rider (CC HR)
        await sendEmail({
            to: data.email,
            cc: 'hr@shreejientserv.in',
            subject: 'Freelance Rider Agreement - Contract Acceptance Confirmation',
            html: commonHtml('FREELANCE RIDER AGREEMENT'),
            attachments: files
        });

        // Email 2: To Activation Team (CC Rider)
        await sendEmail({
            to: 'activate@shreejientserv.in',
            cc: data.email,
            subject: 'Rider Activation Details',
            html: commonHtml('Rider Activation Details'),
            attachments: files
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing new rider contract:', error);
        return NextResponse.json({ success: false, error: 'Failed to process application' }, { status: 500 });
    }
}
