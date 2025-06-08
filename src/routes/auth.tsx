import { Card } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import SignInForm from "~/components/features/Auth/SignInForm";
import SignUpForm from "~/components/features/Auth/SignUpForm";

export default function AuthPage() {
    return (
        <div class="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center p-4 bg-gradient-to-b from-blue-50 via-purple-50 to-white">
            <Tabs defaultValue="sign-in" class="w-full max-w-md">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <Card>
                        <SignInForm />
                    </Card>
                </TabsContent>
                <TabsContent value="sign-up">
                    <Card>
                        <SignUpForm />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}