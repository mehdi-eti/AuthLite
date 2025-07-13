/** @format */

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState, type HTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { OTPSchema, AuthLayout } from ".";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function OtpForm({ className, ...props }: HTMLAttributes<HTMLFormElement>) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof OTPSchema>>({
		resolver: zodResolver(OTPSchema),
		defaultValues: { otp: "" },
	});

	function onSubmit(data: z.infer<typeof OTPSchema>) {
		setIsLoading(true);
		console.log(data);

		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-2", className)} {...props}>
				<FormField
					control={form.control}
					name='otp'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputOTP maxLength={6} {...field} containerClassName='sm:[&>[data-slot="input-otp-group"]>div]:w-14'>
									<InputOTPGroup>
										{[...Array(6)].map((_, i) => (
											<InputOTPSlot key={i} index={i} />
										))}
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='mt-2' disabled={isLoading}>
					Verify
				</Button>
			</form>
		</Form>
	);
}

export function Otp({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<AuthLayout>
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<Card>
					<CardHeader className='text-center'>
						<CardTitle className='text-xl'>Two-factor Authentication</CardTitle>
						<CardDescription>
							Please enter the authentication code. <br /> We have sent the authentication code to your email.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<OtpForm />
					</CardContent>
				</Card>
				<div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
					By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
				</div>
			</div>
		</AuthLayout>
	);
}
