'use client';
import React, { useEffect, useMemo } from 'react';
import UserIcon from '@/icons/UserIcon.svg'; // dùng icon tuỳ ý, hoặc thay bằng 👤 như AddUserPopup
import type { User } from '@/types/User';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Role } from './page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUser } from '@/hooks/CRUD/useUpdateUser';

const schema = z.object({
  _id: z.string(),
  username: z.string().trim().min(1, 'Username is required').max(200),
  email: z.string().trim().email('Invalid email'),
  role: z.string().trim().min(1, 'Role is required'),
  status: z.string().trim().min(1, 'Status is required'),
  // password optional khi update
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100)
    .optional()
    .or(z.literal('')),
  avatar: z.string().url('Avatar must be a valid URL'),
});

export type UpdateUserForm = z.infer<typeof schema>;

interface UpdateUserPopupProps {
  selectedUser: User;
  roles: Role[];
  onCancel: () => void;
  onUpdate: () => void;
}

export default function UpdateUserPopup({
  selectedUser,
  roles,
  onCancel,
  onUpdate,
}: UpdateUserPopupProps) {
  const roleNames = useMemo(() => roles.map((r: Role) => String(r.name)), [roles]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: selectedUser._id,
      username: '',
      email: '',
      role: '',
      status: '',
      password: '',
      avatar: 'https://ui-avatars.com/api/?name=User',
    },
    mode: 'onBlur',
    shouldUnregister: false,
  });

  useEffect(() => {
    if (!selectedUser?._id) return;
    const roleName = selectedUser.role?.toString?.() ?? ''; // tuỳ theo shape user.role
    const validRole = roleName && roleNames.includes(roleName) ? roleName : '';
    reset(
      {
        _id: selectedUser._id,
        username: selectedUser.username ?? '',
        email: selectedUser.email ?? '',
        role: validRole,
        status: selectedUser.status ?? '',
        password: '',
        avatar:
          selectedUser.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.username || 'User')}`,
      },
      { keepDirtyValues: false },
    );
  }, [selectedUser?._id, roleNames, reset]);

  const avatarPreview = watch('avatar');

  const { mutateAsync, isPending, isSuccess, error } = useUpdateUser();
  async function onValidSubmit(form: UpdateUserForm) {
    // Nếu password trống, có thể bỏ trước khi gửi tuỳ backend
    const payload = { ...form } as UpdateUserForm;
    await mutateAsync({ data: payload });
    onUpdate();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 p-2 rounded">
              {UserIcon ? <UserIcon className="w-6 h-6 text-black" /> : <span>👤</span>}
            </div>
            <h2 className="font-semibold text-lg">Update User</h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
        {isSuccess && <p className="text-green-600 text-sm">Cập nhật xong!</p>}
        <hr className="border-gray-300 mb-6" />

        {/* Form */}
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
          <input
            type="text"
            {...register('username')}
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}

          <input
            type="email"
            disabled
            {...register('email')}
            placeholder="Email"
            className="w-full border border-gray-300 bg-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

          <Controller
            control={control}
            name="role"
            render={({ field }) => {
              const onRoleChange = (next: string) => {
                const nextStr = String(next);
                // LỌC: bỏ qua '' hoặc giá trị không nằm trong options (nhịp clear/invalid)
                if (!roleNames.includes(nextStr) || nextStr === '') return;
                field.onChange(nextStr);
              };
              return (
                <>
                  <Select value={field.value} onValueChange={onRoleChange}>
                    <SelectTrigger className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      className="max-h-60 overflow-y-auto overflow-x-hidden bg-white rounded-md border shadow-md"
                    >
                      {roles.map((r: Role) => (
                        <SelectItem key={String(r._id)} value={String(r.name)} className="pl-8">
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>
                  )}
                </>
              );
            }}
          />
          <input
            type="status"
            {...register('status')}
            placeholder="Status"
            className="w-full border border-gray-300  rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          <input
            type="text"
            {...register('avatar')}
            placeholder="Avatar URL"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.avatar && <p className="text-red-600 text-sm">{errors.avatar.message}</p>}

          {/* Preview avatar */}
          <div className="flex items-center gap-3">
            <img
              src={avatarPreview}
              alt="Avatar preview"
              width={48}
              height={48}
              className="rounded-full border w-12 h-12 object-cover"
            />
            <span className="text-xs text-gray-500 break-all">{avatarPreview}</span>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 bg-gray-300 rounded font-semibold hover:bg-gray-400"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 bg-black text-white rounded font-semibold hover:bg-gray-900 disabled:opacity-70"
            >
              {isPending ? 'UPDATING…' : 'UPDATE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
