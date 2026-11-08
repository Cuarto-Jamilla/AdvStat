'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { IconUser } from '@/components/Icons';
import { useApp } from '@/components/Providers';

export default function AccountPage() {
  const { user, updateUser } = useApp();
  const [picture, setPicture] = useState<string | null>(user?.profilePicture || null);
  const [pictureDirty, setPictureDirty] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setError('Choose a PNG, JPEG, or WebP image smaller than 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPicture(reader.result);
        setPictureDirty(true);
        setError('');
        setNotice('');
      }
    };
    reader.readAsDataURL(file);
  };

  const savePicture = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ profilePicture: picture }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to update profile picture.');
      updateUser({ profilePicture: data.profilePicture });
      setPictureDirty(false);
      setNotice('Profile picture updated.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to update profile picture.');
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setNotice('');
    if (newPassword.length < 6) return setError('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('New passwords do not match.');
    setBusy(true);
    try {
      const response = await fetch('/api/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to change password.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setNotice('Password changed successfully.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to change password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <header className="page-heading"><p className="eyebrow">PERSONAL SETTINGS</p><h1 className="title"><span className="bigicon a sm"><IconUser /></span>Account</h1><p className="muted">Manage your profile and sign-in details.</p></header>
      {error && <div className="error" role="alert">{error}</div>}
      {notice && <div className="success-message" role="status">{notice}</div>}
      <section className="card account-card" aria-labelledby="profile-heading">
        <div className="section-heading compact"><div><p className="eyebrow">PROFILE</p><h2 id="profile-heading">Profile picture</h2></div></div>
        <div className="profile-editor">
          <div className="profile-preview">{picture ? <img src={picture} alt="Profile preview" /> : <IconUser size={32} />}</div>
          <div className="profile-fields"><b>{user?.name}</b><span className="muted small">{user?.email}</span><div className="row"><label className="file-button">Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectPicture} /></label>{picture && <button className="ghost solid" onClick={() => { setPicture(null); setPictureDirty(true); }}>Remove picture</button>}{pictureDirty && <button className="primary" onClick={savePicture} disabled={busy}>{busy ? 'Saving…' : 'Save picture'}</button>}</div><p className="muted small">PNG, JPEG, or WebP. Maximum file size: 1 MB.</p></div>
        </div>
      </section>
      <form className="card account-card password-form" onSubmit={changePassword}>
        <div className="section-heading compact"><div><p className="eyebrow">SECURITY</p><h2>Change password</h2></div></div>
        <div className="fields">
          <label>Current password<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
          <span />
          <label>New password<input type="password" autoComplete="new-password" minLength={6} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
        </div>
        <button className="primary" disabled={busy}>Update password</button>
      </form>
    </div>
  );
}