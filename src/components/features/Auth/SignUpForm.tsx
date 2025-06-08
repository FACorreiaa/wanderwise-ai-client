import { Button } from "@/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/card";
import { TextField, TextFieldRoot, TextFieldLabel } from "@/ui/textfield";

import { Mail, KeyRound, UserPlus, User } from "lucide-solid";
import { createSignal } from "solid-js";

export default function SignUpForm() {
    const [name, setName] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        console.log("Signing up with:", { name: name(), email: email(), password: password() });
        // Add your actual registration logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardHeader class="text-center">
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Start your journey with WanderWiseAI today.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <TextFieldRoot class="space-y-2">
                    <TextFieldLabel for="name">Name</TextFieldLabel>
                    <div class="relative">
                        <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <TextField
                            id="name"
                            type="text"
                            placeholder="Your Name"
                            required
                            class="pl-10"
                            value={name()}
                            onInput={e => setName(e.currentTarget.value)}
                        />
                    </div>
                </TextFieldRoot>
                <TextFieldRoot class="space-y-2">
                    <TextFieldLabel for="email-signup">Email</TextFieldLabel>
                    <div class="relative">
                        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <TextField
                            id="email-signup"
                            type="email"
                            placeholder="name@example.com"
                            required
                            class="pl-10"
                            value={email()}
                            onInput={e => setEmail(e.currentTarget.value)}
                        />
                    </div>
                </TextFieldRoot>
                <TextFieldRoot class="space-y-2">
                    <TextFieldLabel for="password-signup">Password</TextFieldLabel>
                    <div class="relative">
                        <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <TextField
                            id="password-signup"
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
                    <UserPlus class="mr-2 h-4 w-4" />
                    Sign Up
                </Button>
                <p class="text-xs text-muted-foreground text-center px-4">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
            </CardFooter>
        </form>
    );
}