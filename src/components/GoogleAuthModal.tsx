import React, { useState } from 'react';
import { UserAccount } from '../types';
import {
  getRegisteredAccounts,
  createGoogleAccount,
  loginGoogleAccount,
  setCurrentUser,
} from '../services/authService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSwitchUser: (newUser: UserAccount) => void;
  onRequestDeleteAccount?: (account: UserAccount) => void;
}

type AuthTab = 'list' | 'login' | 'register';

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onRequestDeleteAccount,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('list');
  const [accounts, setAccounts] = useState<UserAccount[]>(getRegisteredAccounts());

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');

  // Register form state
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regStoreName, setRegStoreName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = (acc: UserAccount) => {
    setCurrentUser(acc);
    onSwitchUser(acc);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginEmail.includes('@')) {
      setErrorMsg('Masukkan alamat email Google yang valid (contoh: user@gmail.com)');
      return;
    }

    const { user, isNew } = loginGoogleAccount(loginEmail);
    setAccounts(getRegisteredAccounts());
    onSwitchUser(user);

    if (isNew) {
      setSuccessMsg(`Akun baru ${user.email} berhasil didaftarkan dan aktif!`);
    } else {
      setSuccessMsg(`Berhasil masuk ke akun ${user.email}!`);
    }

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regEmail || !regEmail.includes('@')) {
      setErrorMsg('Masukkan alamat email Google yang valid (contoh: user@gmail.com)');
      return;
    }

    const created = createGoogleAccount(regEmail, regName, regStoreName);
    setAccounts(getRegisteredAccounts());
    onSwitchUser(created);
    setSuccessMsg(`Toko ${created.storeName} berhasil didaftarkan dengan akun ${created.email}!`);

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 shadow-2xl border border-surface-container overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center border border-slate-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                Akun Google TokoMate
              </h3>
              <p className="text-[11px] text-on-surface-variant">Multi-Tenant Cloud &amp; Penyimpanan Mandiri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs: Akun Tersimpan, Masuk (Login), Daftar Baru (Register) */}
        <div className="flex border-b border-surface-container mt-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('list');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">badge</span>
            <span>Akun Saya ({accounts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'login'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">login</span>
            <span>Masuk (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'register'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">person_add</span>
            <span>Daftar Baru</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mt-2.5 p-2 rounded-xl bg-error-container/20 text-error text-xs font-medium flex items-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        <div className="py-3 overflow-y-auto no-scrollbar flex flex-col gap-3">
          {/* TAB 1: LIST / SAVED ACCOUNTS */}
          {activeTab === 'list' && (
            <>
              {/* Active Tenant Box */}
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-on-surface truncate">{currentUser.name}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold shrink-0">
                      Aktif Bertugas
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate font-mono">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-primary font-semibold">
                    <span>🏬 {currentUser.storeName || 'Toko Anda'}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{currentUser.tenantId}</span>
                  </div>
                </div>

                {onRequestDeleteAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestDeleteAccount(currentUser);
                    }}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Hapus Akun Ini &amp; Seluruh Data Toko"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}
              </div>

              {/* List of registered accounts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface">Pilih / Ganti Akun Google Toko:</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                    <span>Tambah Toko</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto no-scrollbar">
                  {accounts.map((acc) => {
                    const isActive = acc.email.toLowerCase() === currentUser.email.toLowerCase();
                    return (
                      <div
                        key={acc.id}
                        className={`p-2.5 rounded-xl flex items-center justify-between text-left transition-all border ${
                          isActive
                            ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                            : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low text-on-surface'
                        }`}
                      >
                        <div
                          onClick={() => handleSelectAccount(acc)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <img
                            src={acc.picture}
                            alt={acc.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold truncate text-on-surface">{acc.name}</p>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-on-surface-variant font-mono truncate">{acc.email}</p>
                            <p className="text-[10px] text-slate-500 truncate">{acc.storeName || 'Toko'}</p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {!isActive ? (
                            <button
                              type="button"
                              onClick={() => handleSelectAccount(acc)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
                            >
                              Pilih
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 px-1.5">
                              <span className="material-symbols-outlined text-[15px]">check_circle</span>
                              <span>Dipakai</span>
                            </span>
                          )}

                          {onRequestDeleteAccount && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onRequestDeleteAccount(acc);
                              }}
                              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg cursor-pointer transition-colors"
                              title={`Hapus Akun ${acc.email}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MASUK (LOGIN) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Masuk ke Toko Anda</h4>
                  <p className="text-[11px] text-on-surface-variant">Gunakan email Google yang sudah terdaftar</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">
                  Email Google Toko:
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="contoh: manajemeninovasi19@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container focus:outline-hidden focus:border-primary font-mono"
                />
              </div>

              <div className="text-[11px] text-on-surface-variant bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container flex items-start gap-1.5">
                <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">info</span>
                <span>
                  Jika email sudah terdaftar, seluruh transaksi, produk, dan saldo toko Anda akan langsung dimuat kembali secara otomatis.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Masuk Sekarang</span>
              </button>
            </form>
          )}

          {/* TAB 3: DAFTAR BARU (REGISTER) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">store</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Daftar Akun Toko Baru</h4>
                  <p className="text-[11px] text-on-surface-variant">Buka ruang toko terpisah (Multi-Tenant mulai bersih)</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">
                  Email Google Pemilik:
                </label>
                <input
                  type="email"
                  required
                  placeholder="toko.baru@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container focus:outline-hidden focus:border-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">
                    Nama Pemilik:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rian"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container focus:outline-hidden focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-on-surface-variant font-semibold block mb-1">
                    Nama Toko:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Toko Berkah 2"
                    value={regStoreName}
                    onChange={(e) => setRegStoreName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="text-[11px] text-on-surface-variant bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container flex items-start gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">check_circle</span>
                <span>
                  Ruang toko baru akan dibuat bersih mandiri dengan katalog produk awal dan saldo laci kasir Rp 0.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-dim transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_business</span>
                <span>Daftar &amp; Buka Ruang Toko</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-surface-container flex justify-between items-center text-xs">
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">lock</span>
            <span>Data Toko Terisolasi Mandiri</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
