"use client";

import React, { useEffect } from "react";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User as UserIcon, Phone, Lock, Save } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { authAPI } from "@/lib/api";
import { User } from "@/types/api";

export default function ProfileForm({
  profile,
  setProfile,
}: {
  profile: User;
  setProfile: (user: User) => void;
}) {
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    profileForm.reset({
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
    });
  }, [profileForm]);

  const onUpdateProfile = async (data: UpdateProfileInput) => {
    try {
      const updated = await authAPI.updateProfile(data);
      setProfile(updated);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/50 border-b p-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="w-5 h-5" />
          Update Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:pt-6">
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onUpdateProfile)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10 h-11"
                          placeholder="Enter your full name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10 h-11"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
                className="gap-2 px-6"
              >
                {profileForm.formState.isSubmitting ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
