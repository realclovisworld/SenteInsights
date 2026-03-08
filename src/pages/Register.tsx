import { SignUp } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
        />
      </div>
      <Footer />
    </div>
  );
};

export default Register;
