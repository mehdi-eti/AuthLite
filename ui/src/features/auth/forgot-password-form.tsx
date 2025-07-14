/** @format */

import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, type HTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authPaths, AuthLayout, forgotPasswordSchema } from ".";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

function SignInForm({ className, ...props }: HTMLAttributes<HTMLFormElement>) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
		setIsLoading(true);
		console.log(data);

		setTimeout(() => setIsLoading(false), 3000);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-3", className)} {...props}>
				<div className='grid gap-6'>
					<div className='grid gap-6'>
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
						<Button type='submit' className='w-full' disabled={isLoading}>
							Continue
						</Button>
					</div>
					<div className='text-center text-sm'>
						Don&apos;t have an account?{" "}
						<Link to={authPaths.SignUp} className='underline underline-offset-4'>
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
}

export function ForgotPassword({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<AuthLayout>
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<Card>
					<CardHeader className='text-center'>
						<CardTitle className='text-xl'>Forgot Password</CardTitle>
						<CardDescription>
							Enter your registered email and <br /> we will send you a link to reset your password.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInForm />
					</CardContent>
				</Card>
				<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
					By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
				</div>
			</div>
		</AuthLayout>
	);
}
