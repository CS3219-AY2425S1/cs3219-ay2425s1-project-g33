"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { User, Lock } from 'lucide-react';

export default function DashboardPage() {

// Define form state
const [formData, setFormData] = useState({
  username: '',
  password: '',
});

const [errors, setErrors] = useState<{ [key: string]: string}>({});

// Handle input changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({...formData, [e.target.name]: e.target.value });
};

// Handle form submission
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setErrors({});

  let formErrors: {[key: string]: string} = {};
  if (!formData.username) formErrors.username = "Username is required";
  if (!formData.password) formErrors.password = "Password is required";

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    // add API call here
    console.log("Form submitted successfully", formData);
  } catch (error) {
    console.error("Login failed", error);
    setErrors({submit: "Login failed. Please try again."});
  }
};

return (
  <div className="min-h-screen max-w-sm container grid gap-4 mx-auto items-center">
    <section className="col-span-9 flex flex-col gap-4 ">
      <Card className="bg-background-200 p-3">
        <div className="flex flex-col p-8">
          <h1 className="font-bold text-2xl mb-2"> Welcome!</h1>
          <h2 className="mb-6">Log in to start coding!</h2>

          {/* To input log in details */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-y-4"> 
              <div className="relative">
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username / Email"
                  value={formData.username}
                  onChange={handleChange}
                  className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                  />
                  {errors.username && <p className="text-difficulty-hard">{errors.username}</p>}
              </div>


              <div className='relative'>
                <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-foreground-100" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-md w-full py-2 pl-10 bg-input-foreground text-input"
                  />
                  {errors.password && <p className="text-difficulty-hard">{errors.password}</p>}
              </div>
            </div>
            
            {/* Error message for submission */}
            {errors.submit && <p className="text-difficulty-hard">{errors.submit}</p>}


            {/* Forgot password link */}
            <div className="text-right pt-2 pb-2"> 
              <Link href="/forgotpassword" className="hover:underline text-sm"> Forgot password? </Link>
            </div>
            
            {/* Sign In Button */}
            <button 
              type="submit"
              className="w-full bg-primary font-bold rounded-md py-2"
            > 
            Sign In
            </button>
          </form>

          {/* Or sign in with */}
          <div className="flex items-center my-6"> 
            <hr className="flex-grow muted-foreground border-t" />
            <span className="mx-2 text-sm">Or sign in with</span>
            <hr className="flex-grow border-t"/>
            
          </div>
          
          {/* Socials */}
          <div className="flex flex-row gap-x-4 justify-center">
            <button className="rounded-md">
              {/*<FaGithub size={24}/> */}
            </button>

            <button className="rounded-md">
              {/* <FaGoogle size={24}/>*/}
            </button>
          </div>

          {/* Sign up here */}
          <div className="text-center justify-center text-sm mt-6"> 
            <p> No account yet? <Link href="/signup" className="hover: underline text-primary">Sign up</Link> </p>
          </div>

        </div>
      </Card>
    </section>
  </div>
  );
}

