import { SignIn } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          afterSignInUrl="/dashboard"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
