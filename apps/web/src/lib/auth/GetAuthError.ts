import { authClient } from "./AuthClient";

type AuthErrorCode=keyof typeof authClient.$ERROR_CODES;

const AUTH_ERROR_MESSAGES: Partial<Record<AuthErrorCode, string>>={

    INVALID_EMAIL_OR_PASSWORD: "E-posta adresi veya şifre hatalı.",
    INVALID_EMAIL: "Geçersiz e-posta adresi.",
    INVALID_PASSWORD: "Şifre hatalı.",
    USER_NOT_FOUND: "Kullanıcı bulunamadı.",
    USER_ALREADY_EXISTS: "Bu e-posta adresiyle kayıtlı bir hesap zaten var.",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Bu e-posta adresi zaten kullanımda.",
    PASSWORD_TOO_SHORT: "Şifre çok kısa. En az 8 karakter giriniz",
    PASSWORD_TOO_LONG: "Şifre çok uzun.",
    EMAIL_NOT_VERIFIED: "E-posta adresiniz henüz doğrulanmamış.",
    SESSION_EXPIRED: "Oturum süreniz doldu, lütfen tekrar giriş yapın.",
    INVALID_TOKEN: "Sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
    TOKEN_EXPIRED: "Sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir bağlantı isteyin.",
    FAILED_TO_CREATE_USER: "Hesap oluşturulamadı, lütfen tekrar deneyin.",
    FAILED_TO_CREATE_SESSION: "Oturum açılamadı, lütfen tekrar deneyin.",
};

export function getAuthError(code?: string, fallback="İşlem sırasında bir hata oluştu."){

    if(code && code in AUTH_ERROR_MESSAGES){

        return AUTH_ERROR_MESSAGES[code as AuthErrorCode]!;
    }

    return fallback;
}
