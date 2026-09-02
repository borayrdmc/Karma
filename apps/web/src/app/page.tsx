"use client";

import { authClient } from "../lib/AuthClient";
import { useState } from "react";

export default function Home() {
  const { data: session, isPending, error } = authClient.useSession();
  const [log, setLog] = useState<string>("Henüz bir işlem yapılmadı.");
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Manuel Kayıt Testi
  const handleSignUp = async () => {
    setLoading(true);
    setLog("Kayıt olunuyor...");
    try {
      const res = await authClient.signUp.email({
        email: "testuser@karma.com",
        password: "KarmaPassword123!",
        name: "Test Kullanıcısı",
      });

      if (res.error) {
        setLog(`Kayıt Hatası: ${res.error.message}`);
      } else {
        setLog(`Kayıt Başarılı!\n${JSON.stringify(res.data, null, 2)}`);
      }
    } catch (err: any) {
      setLog(`Sistem Hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Manuel Giriş Testi
  const handleSignIn = async () => {
    setLoading(true);
    setLog("Giriş yapılıyor...");
    try {
      const res = await authClient.signIn.email({
        email: "testuser@karma.com",
        password: "KarmaPassword123!",
      });

      if (res.error) {
        setLog(`Giriş Hatası: ${res.error.message}`);
      } else {
        setLog(`Giriş Başarılı!\n${JSON.stringify(res.data, null, 2)}`);
      }
    } catch (err: any) {
      setLog(`Sistem Hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Çıkış Yapma Testi
  const handleSignOut = async () => {
    setLoading(true);
    setLog("Çıkış yapılıyor...");
    try {
      await authClient.signOut();
      setLog("Başarıyla çıkış yapıldı!");
    } catch (err: any) {
      setLog(`Çıkış Hatası: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🛒 Karma Auth & DB Test Paneli</h1>
      <p>Bu panel backend ve veritabanı bağlantılarını doğrudan test etmek için oluşturulmuştur.</p>

      <hr style={{ margin: "1.5rem 0" }} />

      {/* Aktif Oturum Durumu */}
      <section style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <h3>👤 Aktif Oturum (Session) Durumu:</h3>
        {isPending ? (
          <p>Oturum yükleniyor...</p>
        ) : session ? (
          <div style={{ color: "green" }}>
            <p><strong>Giriş Yapıldı!</strong></p>
            <ul>
              <li><strong>User ID:</strong> {session.user.id}</li>
              <li><strong>İsim:</strong> {session.user.name}</li>
              <li><strong>E-Posta:</strong> {session.user.email}</li>
              <li><strong>Session Token Expiry:</strong> {new Date(session.session.expiresAt).toLocaleString()}</li>
            </ul>
          </div>
        ) : (
          <p style={{ color: "red" }}>Aktif bir oturum bulunamadı (Giriş yapılmamış).</p>
        )}
      </section>

      {/* Test Butonları */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={handleSignUp}
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", cursor: "pointer", background: "#0070f3", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          1. Test Kullanıcısı Oluştur (Sign Up)
        </button>

        <button
          onClick={handleSignIn}
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", cursor: "pointer", background: "#10b981", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          2. Giriş Yap (Sign In)
        </button>

        <button
          onClick={handleSignOut}
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", cursor: "pointer", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px" }}
        >
          3. Çıkış Yap (Sign Out)
        </button>
      </div>

      {/* Log Output Kutusu */}
      <section>
        <h3>📋 İşlem Log Çıktısı:</h3>
        <pre style={{ background: "#1e1e1e", color: "#00ff00", padding: "1rem", borderRadius: "8px", overflowX: "auto", minHeight: "120px" }}>
          {log}
        </pre>
      </section>
    </main>
  );
}