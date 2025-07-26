import * as z from "zod";

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Question schemas
export const questionSchema = z
  .object({
    text: z.string().min(2, "Question text must be at least 2 characters"),
    subjectId: z.number().min(1, "Please select a subject"),
    choices: z
      .array(
        z.object({
          text: z.string().min(1, "Choice text is required"),
          isCorrect: z.boolean(),
        })
      )
      .min(2, "At least 2 choices are required")
      .max(4, "Maximum 4 choices allowed"),
  })
  .refine(
    (data) => {
      const correctChoices = data.choices.filter((choice) => choice.isCorrect);
      return correctChoices.length === 1;
    },
    {
      message: "Exactly one choice must be marked as correct",
      path: ["choices"],
    }
  );

export const choiceSchema = z.object({
  text: z.string().min(1, "Choice text is required"),
  isCorrect: z.boolean(),
});

// Subject schema
export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
});

// Profile schema
export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().min(5, "Phone number is too short"),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type ChoiceFormData = z.infer<typeof choiceSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
