/** @format */

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, type HTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ErrorResponseParams } from "./types";
import { authPaths, AuthLayout, PasswordInput, registerSchema, apiRoutes } from ".";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorPropsFields = "email" | "confirmPassword" | "password" | "firstName" | "lastName" | "phone" | "username";

export function SignUpForm({ className, ...props }: HTMLAttributes<HTMLFormElement>) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "etezadi_mehdi@yahoo.com",
			confirmPassword: "Mehdi123456**",
			password: "Mehdi123456**",
			firstName: "Mehdi",
			lastName: "Eti",
			phone: "09359971938",
			username: "admin",
		},
	});

	async function onSubmit(data: z.infer<typeof registerSchema>) {
		setIsLoading(true);
		const url = apiRoutes.register;
		const options = {
			method: "POST",
			headers: { "content-type": "application/json", "User-Agent": navigator.userAgent },
			body: JSON.stringify(data),
		};

		const response = await fetch(url, options);
		if (!response.ok) {
			setIsLoading(false);
			const data: ErrorResponseParams = await response.json();
			if (data.validationErrors) {
				data.validationErrors?.forEach((err) => {
					form.setError(err.field as ErrorPropsFields, { type: "manual", message: err.message });
				});
			} else toast.error(data.message);
			return;
		}

		navigate(authPaths.OTP);
		return setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-3", className)} {...props}>
				<div className='grid gap-6'>
					<div className='grid gap-6'>
						<div className='flex gap-5'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input placeholder='محمد مهدی' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input placeholder='اعتضادی' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder='test' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='name@example.com' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input placeholder='09123456789' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder='********' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder='********' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full' disabled={isLoading}>
							Continue
						</Button>
					</div>
					<div className='text-center text-sm'>
						Already have an account?{" "}
						<Link to={authPaths.SignIn} className='underline underline-offset-4'>
							Sign in
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
}

export function SignUp({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<AuthLayout>
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<Card>
					<CardHeader className='text-center'>
						<CardTitle className='text-xl'>Create your account</CardTitle>
						<CardDescription>Welcome! Please fill in the details to get started</CardDescription>
					</CardHeader>
					<CardContent>
						<SignUpForm />
					</CardContent>
				</Card>
				<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
					By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
				</div>
			</div>
		</AuthLayout>
	);
}
