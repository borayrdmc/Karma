interface SendResetPasswordEmailParams {
    email: string;
    name?: string | null;
    url: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function sendResetPasswordEmail({ email, name, url }: SendResetPasswordEmailParams): Promise<void> {

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Karma <noreply@karmatakip.com>";

    if (process.env.NODE_ENV === "development" || !apiKey) {
        console.log(`[PASSWORD_RESET] E-posta: ${email} | URL: ${url}`);
        if (!apiKey) {
            return;
        }
    }

    const safeName = name ? escapeHtml(name) : "Kullanıcı";
    const safeUrl = escapeHtml(url);

    const html = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Karma - Şifre Sıfırlama</title>
        </head>
        <body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#09090b;padding:40px 16px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#121215;border:1px solid #27272a;border-radius:16px;padding:32px;">
                            <tr>
                                <td style="padding-bottom:20px;">
                                    <span style="display:inline-block;background-color:#10b981;color:#09090b;font-weight:700;font-size:14px;padding:6px 10px;border-radius:8px;letter-spacing:0.5px;">KARMA</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:20px;font-weight:600;color:#f4f4f5;padding-bottom:12px;">
                                    Şifre Sıfırlama İsteği
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;line-height:1.6;color:#a1a1aa;padding-bottom:24px;">
                                    Merhaba ${safeName},<br /><br />
                                    Karma hesabınız için bir şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayabilirsiniz:
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding-bottom:24px;">
                                    <a href="${safeUrl}" target="_blank" style="display:inline-block;background-color:#10b981;color:#09090b;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:12px;">
                                        Şifremi Sıfırla
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:12px;line-height:1.5;color:#71717a;padding-bottom:16px;word-break:break-all;">
                                    Butona tıklayamıyorsanız aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:<br />
                                    <a href="${safeUrl}" style="color:#34d399;text-decoration:underline;">${safeUrl}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-top:1px solid #27272a;padding-top:16px;font-size:12px;line-height:1.5;color:#52525b;">
                                    Bu isteği siz yapmadıysanız bu e-postayı güvenle görmezden gelebilirsiniz. Şifreniz değiştirilmeyecektir.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `.trim();

    const text = `Merhaba ${name || "Kullanıcı"},\n\nKarma hesabınız için şifre sıfırlama bağlantınız:\n${url}\n\nBu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.`;

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: "Karma - Şifre Sıfırlama Bağlantısı",
            html,
            text,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        console.error(`[RESEND_ERROR] Status: ${response.status} | Body: ${errorBody}`);
        throw new Error("Şifre sıfırlama e-postası gönderilemedi.");
    }
}
