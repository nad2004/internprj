'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore, UserState } from '@/store/userStore';
import { BookOpen, Trophy } from 'lucide-react';
import ChangePasswordDialog from '@/components/ChangePasswordDialog';
import { useAuthStore } from '@/store/authStore';
import FormOverlay from '@/components/FormOverlay';

const UPLOAD_URL = 'http://localhost:8080/api/upload/image';       // POST field 'file'
const UPDATE_ME   = () => `http://localhost:8080/api/user`;         // PATCH {_id, ...}

export default function AccountSettings() {
  const profile = useUserStore((s: UserState) => s.profile);
  const setUser = useUserStore((s: UserState) => s.setUser);

  const loading = useAuthStore((s) => s.loading);
  const { authStart, authSuccess } = useAuthStore();

  const [username, setUsername] = useState(profile?.username ?? '');
  const [saving, setSaving] = useState(false);

  const [localAvatar, setLocalAvatar] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsername(profile?.username ?? '');
    setLocalAvatar(undefined);
  }, [profile?.username, profile?.avatar]);

  const initials = useMemo(() => {
    const name = profile?.username || 'U';
    const [a, b] = name.trim().split(' ');
    return (a?.[0] + (b?.[0] || '')).toUpperCase();
  }, [profile?.username]);

  async function handleUpdate() {
    if (!profile?._id) return;
    try {
      setSaving(true);
      const { data } = await axios.patch(UPDATE_ME(), { _id: profile._id, username });
      setUser?.(data?.user ?? { ...profile, username });
    } catch (err) {
      console.error(err);
      alert('Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setUsername(profile?.username ?? '');
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn đúng file ảnh');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn (tối đa 5MB)');
      e.target.value = '';
      return;
    }

    const preview = URL.createObjectURL(file);
    setLocalAvatar(preview);

    try {
      authStart();
      const fd = new FormData();
      fd.append('file', file);

      const { data } = await axios.post(UPLOAD_URL, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const uploadedUrl = data?.data?.url ?? data?.secure_url;
      if (!uploadedUrl) throw new Error('Upload không trả về URL');

      if (profile?._id) {
        const res = await axios.patch(
          UPDATE_ME(),
          { _id: profile._id, avatar: uploadedUrl },
          { withCredentials: true },
        );
        setUser?.(res.data?.user ?? { ...profile, avatar: uploadedUrl });
      }
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
      setLocalAvatar(undefined);
    } finally {
      authSuccess();
      if (fileRef.current) fileRef.current.value = '';
      URL.revokeObjectURL(preview);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <FormOverlay loading={loading} />

      {/* avatar + stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={localAvatar || profile?.avatar} alt={profile?.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-xs text-slate-500">
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              onClick={(e) => ((e.target as HTMLInputElement).value = '')}
              className="
                h-10
                file:mr-3 file:rounded-md file:border-0
                file:bg-slate-100 file:px-3 file:py-2
                file:text-sm file:font-medium file:text-slate-700
                hover:file:bg-slate-200
              "
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            value={120}
            label="Readings"
            color="from-[#ff8a73] to-[#ff6b57]"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            value={10}
            label="Contribution"
            color="from-[#7b6dff] to-[#8f74ff]"
          />
        </div>
      </div>

      {/* form */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-1 block text-slate-600">Full name</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="h-10"
          />
        </div>

        <div>
          <Label className="mb-1 block text-slate-600">College Email ID</Label>
          <Input value={profile?.email || ''} readOnly disabled className="h-10" />
        </div>

        <div>
          <Label className="mb-1 block text-slate-600">Role</Label>
          <Input value={profile?.role || ''} readOnly disabled className="h-10" />
        </div>

        <div>
          <Label className="mb-1 block text-slate-600">Status</Label>
          <Input value={profile?.status || 'active'} readOnly disabled className="h-10" />
        </div>

        <div className="md:col-span-2">
          <Label className="mb-1 block text-slate-600">Bio</Label>
          <Textarea placeholder="I'm a student" readOnly disabled className="min-h-[120px] resize-none" />
        </div>
      </div>

      {/* actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          onClick={handleUpdate}
          disabled={!profile?._id || saving || username.trim() === (profile?.username ?? '')}
          className="rounded-lg bg-[#F76B56] text-white hover:brightness-95"
        >
          {saving ? 'Saving…' : 'Update Profile'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setUsername(profile?.username ?? '')}>
          Reset
        </Button>

        <div className="ml-auto">
          <ChangePasswordDialog trigger={<Button variant="outline">Change password</Button>} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white">
      <div className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow`}>{icon}</div>
      <div>
        <div className="text-xl font-semibold leading-5">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
