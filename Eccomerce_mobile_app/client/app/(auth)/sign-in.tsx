import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import type { EmailCodeFactor } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInPage() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [showEmailCode, setShowEmailCode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const onSignInPress = async () => {

        if (!isLoaded || !signIn) return;
        if (!emailAddress || !password) return;

        setLoading(true);
        setError(null);

        try {

            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({
                    session: signInAttempt.createdSessionId,
                });
                router.replace("/");
            } else if (signInAttempt.status === "needs_second_factor") {
                const emailCodeFactor = signInAttempt.supportedSecondFactors?.find((factor): factor is EmailCodeFactor => factor.strategy === "email_code");

                if (emailCodeFactor) {
                    await signIn.prepareSecondFactor({
                        strategy: "email_code",
                        emailAddressId: emailCodeFactor.emailAddressId,
                    });
                    setShowEmailCode(true);
                } else {
                    setError("Email verification not available. Please try again.");
                }
            }
        } catch (err: any) {
            const errorMessage = err?.errors?.[0]?.message || err?.message || 'Sign-in failed';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded || !signIn || !code) return;

        setLoading(true);
        setError(null);
        try {
            const attempt = await signIn.attemptSecondFactor({
                strategy: "email_code",
                code,
            });

            if (attempt.status === "complete") {
                await setActive({
                    session: attempt.createdSessionId,
                });
                router.replace("/");
            }
        } catch (err: any) {
            const errorMessage = err?.errors?.[0]?.message || err?.message || 'Verification failed';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            {!showEmailCode ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
                        <Text className="text-secondary">Sign in to continue</Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">Email</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} />
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Password</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                            <Text className="text-red-600 text-sm">{error}</Text>
                        </View>
                    )}

                    {/* Submit */}
                    <Pressable className={`w-full py-4 rounded-full items-center mb-10 ${loading || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}`} onPress={onSignInPress} disabled={loading || !emailAddress || !password}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                    </Pressable>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Don&apos;t have an account? </Text>
                        <Link href="/sign-up">
                            <Text className="text-primary font-bold">Sign up</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
                        <Text className="text-secondary text-center">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                            <Text className="text-red-600 text-sm">{error}</Text>
                        </View>
                    )}

                    <Pressable className={`w-full py-4 rounded-full items-center ${loading || !code.trim() ? "bg-gray-300" : "bg-primary"}`} onPress={onVerifyPress} disabled={loading || !code.trim()}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
                    </Pressable>

                    <TouchableOpacity onPress={() => setShowEmailCode(false)} className="mt-4">
                        <Text className="text-primary text-center font-medium">Back</Text>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}
