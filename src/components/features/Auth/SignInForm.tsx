import { Button } from "@/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { TextField, TextFieldRoot, TextFieldLabel } from "@/ui/textfield";

import { A } from "@solidjs/router";
import { Mail, KeyRound, LogIn } from "lucide-solid";
import { createSignal } from "solid-js";

export default function SignInForm() {
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        console.log("Signing in with:", { email: email(), password: password() });
        // Add your actual login logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardHeader class="text-center">
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Sign in to access your personalized travel plans.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <TextFieldRoot>
                        <TextFieldLabel for="email">Email</TextFieldLabel>
                        <div class="relative">
                            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <TextField
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                class="pl-10"
                                value={email()}
                                onInput={e => setEmail(e.currentTarget.value)}
                            />
                        </div>
                    </TextFieldRoot>
                </div>
                <TextFieldRoot class="space-y-2">
                    <div class="flex items-center justify-between">

                        <TextFieldLabel for="password">Password</TextFieldLabel>
                        <A href="/forgot-password" class="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </A>
                    </div>
                    <div class="relative">
                        <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <TextField
                            id="password"
                            type="password"
                            required
                            class="pl-10"
                            value={password()}
                            onInput={e => setPassword(e.currentTarget.value)}
                        />
                    </div>
                </TextFieldRoot>
            </CardContent>
            <CardFooter class="flex flex-col gap-4">
                <Button type="submit" class="w-full" size="lg">
                    <LogIn class="mr-2 h-4 w-4" />
                    Sign In
                </Button>
                <p class="text-sm text-muted-foreground text-center">
                    Or continue with
                </p>
                <Button variant="outline" class="w-full">
                    {/* Placeholder for Google/other SSO Icon */}
                    <span class="mr-2">G</span> Sign in with Google
                </Button>
            </CardFooter>
        </form>
    );
}